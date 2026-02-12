import Spinner from 'react-bootstrap/Spinner';

function Loading() {
  return (
    <div className="w-full d-flex justify-content-center my-5">
      <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
  );
}

export default Loading;