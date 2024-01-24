import { useApiFetch } from "../util/api";
import DisplayAlbums from "../components/displayAlbums";
import { useProvideAuth } from "../hooks/useAuth";
import { useRequireAuth } from "../hooks/useRequireAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export default function ProfilePage(props) {
  const { error, isLoading, response } = useApiFetch("/albums");
  const { state } = useProvideAuth();
  const {
    state: { user, isAuthenticated },
  } = useRequireAuth();

  function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  return (
    <main>
      <h1 className="mt-5">{capitalizeFirstLetter(state.user?.username)}'s Album Collection</h1>
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
