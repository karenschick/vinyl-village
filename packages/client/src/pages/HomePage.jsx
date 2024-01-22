import { useApiFetch } from "../util/api";
import DisplayAlbums from "../components/displayAlbums";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function HomePage(props) {
  const { error, isLoading, response } = useApiFetch("/albums");

  return (
    <main>
      <h1 className="mt-5">Album Collection</h1>
      {error && (
        <h3 style={{ color: "red" }}>
          Error Loading Data: {JSON.stringify(error)}
        </h3>
      )}
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      {!error && response && (
        <>
          {/* <div className="mb-5">Username: {response.username}</div> */}
          <DisplayAlbums />
        </>
      )}
    </main>
  );
}
