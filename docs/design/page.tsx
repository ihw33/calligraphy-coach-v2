import Link from 'next/link';

export default function EvaluationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Evaluation Screen</h1>
      <p className="mb-8">This is a placeholder for the evaluation results.</p>
      <div className="space-x-4">
        <Link href="/practice" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Try Again (Back to Practice)
        </Link>
        <Link href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Go to Home
        </Link>
      </div>
    </div>
  );
}