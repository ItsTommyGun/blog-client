import './LoadingIndicator.scss';
import loadingSpinner from "./loading.svg";

export type isLoading = {
    isLoading: boolean
}

function LoadingIndicator({isLoading}: isLoading) {
    return <div className={`loading-indicator ${isLoading ? "loading" : ''}`}>
        <img className={`loading-indicator__spinner`} src={loadingSpinner} alt="Loading ..." />
    </div>
}

export default LoadingIndicator