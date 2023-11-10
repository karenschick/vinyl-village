import { useApiFetch } from "../util/api";
import LoadingSpinner from "../components/LoadingSpinner";
import DisplayAlbums from "../components/displayAlbums";

export default function HomePage(props) {
  const { error, isLoading, response } = useApiFetch("/sample");
  

  return (
    <main>
      <h1>Albums</h1>
      {error && (
        <h3 style={{ color: "red" }}>
          Error Loading Data: {JSON.stringify(error)}
        </h3>
      )}
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      {!error && response && (
        <>
          {/* <div className="mb-5">Username: {response.username}</div> */}
          <DisplayAlbums/>
        </>
      )}
    </main>
  );
}
