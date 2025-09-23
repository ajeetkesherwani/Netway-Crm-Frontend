import { useNavigate } from "react-router"


export default function RetailerUpdate() {
    // const { id } = useParams;
    const navigate = useNavigate;

    return(
        <>
      <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Back
      </button>
      </div>

        </>
    )

  
}