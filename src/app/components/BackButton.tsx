import { useRouter } from "next/navigation";

function BackButton() {
    const router = useRouter();

    return (
        <button
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 transition duration-300 ease-in-out"
            onClick={() => router.back()}
        >
            ← Go Back
        </button>
    )
}

export default BackButton;