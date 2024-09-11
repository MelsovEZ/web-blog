import { useRouter } from "next/navigation";

function BackButton() {
    const router = useRouter();

    return (
        <button
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            onClick={() => router.back()}
        >
            ← Go Back
        </button>
    )
}

export default BackButton;