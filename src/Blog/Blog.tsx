import { useEffect, useState } from "react";
import "./Blog.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPen } from "@fortawesome/free-solid-svg-icons";
import isAdmin from "../helpers/userRole";

import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/css/plugins/table.min.css";
import "froala-editor/js/plugins/table.min.js";

import "froala-editor/js/plugins/lists.min.js";

// import "froala-editor/js/plugins/paragraphFormat.min.js";

import FroalaEditor from "react-froala-wysiwyg";

import { Helmet } from "react-helmet";
import { setLoadingState } from "../App";
import { showNotification, Type } from "../helpers/toast";
import { getRequest, postRequest } from "../helpers/http";

type Entry = {
  time: Date,
  title: string,
  content: string
}

function Blog({handleLoading}: setLoadingState) {
  const [entries, setEntries] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [dataChanged, setDataChanged] = useState("");

  const [showWriteEntry, setShowWriteEntry] = useState(false);

  async function handleErrors(response: any) {
    if (!response.ok) {
      await response.json().then((error: any) => {
        if (error.authStatus === "failed") {
          throw Error("authFailed");
        }
        throw Error(error.message);
      });
    }
    return response.json();
  }

  useEffect(() => {
    getBlogEntries();
  }, [dataChanged]);

  const createBlogEntry = (
    data = {
      title: title,
      content: content,
    }
  ) => {
    if (data.title === "" || data.content === "") {
      return;
    }
    const token = localStorage.getItem("token");
    postRequest("api/entry", data)
      .then(handleErrors)
      .then((resp) => {
        setDataChanged(resp);
        showNotification("Blog entry saved!");
        setShowWriteEntry(false);
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
      });
  };

  const getBlogEntries = () => {
    handleLoading(true);
    getRequest("api/entry")
      .then(handleErrors)
      .then((resp) => {
        resp.reverse();
        setEntries(resp);
        handleLoading(false);
      })
      .catch((error) => {
        if (error.message === "authFailed") {
          localStorage.removeItem("token");

          showNotification("Session expired or token invalid. Please log in.", Type.error);

          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        showNotification(error.message, Type.error);
        handleLoading(false);
      });
  };

  function formatDate(date: Date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join(".");
  }

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tommycodes Blog - Overview</title>
      </Helmet>
      <div className="main">
        {isAdmin() && (
          <div className="">
            <button
              onClick={() => setShowWriteEntry(!showWriteEntry)}
              className="blog-entry__button"
            >
              <FontAwesomeIcon icon={faPen} /> Write entry
            </button>
            {showWriteEntry && (
              <>
                <label>Title of entry</label>
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <label>Content of entry</label>
                <FroalaEditor
                  config={froalaConfiguration}
                  tag="textarea"
                  onModelChange={(model: any) => setContent(model)}
                />
                <button
                  type="submit"
                  className="success"
                  onClick={() => createBlogEntry()}
                >
                  <FontAwesomeIcon icon={faSave} /> Publish entry
                </button>
              </>
            )}
          </div>
        )}

        {entries.length === 0 && <h2>No blog post so far ...</h2>}
        {entries.map((entry: Entry) => {
          var entryDate = formatDate(entry.time);
          return (
            <div key={entry.title} className="blog-entry">
              <div className="blog-entry__meta">
                <h2>{entry.title}</h2>
                <div>Written on {entryDate}</div>
              </div>
              <div className="blog-entry__content" dangerouslySetInnerHTML={{ __html: entry.content }}></div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
}



const froalaConfiguration = {
  docId: "froala-editor",
  toolbarButtons: [
    "fullscreen",
    "bold",
    "italic",
    "underline",
    "strikeThrough",
    "subscript",
    "superscript",
    "|",
    "paragraphFormat",
    "align",
    "formatOL",
    "formatUL",
    "outdent",
    "indent",
    "quote",
    "-",
    "insertLink",
    "insertImage",
    "insertTable",
    "|",
    "fontAwesome",
    "specialCharacters",
    "insertHR",
    "selectAll",
    "clearFormatting",
    "html",
    "|",
    "undo",
    "redo",
  ],
  quickInsertTags: ["p", "div", "h1", "h2", "h3"],
}

export default Blog;
