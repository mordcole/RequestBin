// import { Link, useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { getBin } from "./BinViewService";

// const BinViewPage = () => {
//   const { binRoute } = useParams<{ binRoute: string }>();

//   const mockBin = {
//     bin_route: "abc123",
//     send_url: "/in/abc123",
//     requests: [
//       {
//         id: 1,
//         method: "POST",
//         path: "/in/abc123",
//         created_at: "2026-03-08 10:00:00",
//         headers: { "content-type": "application/json" },
//         body: { raw: '{"hello": "world"}' },
//       },
//     ],
//   };

//   const [bin, setBin] = useState(mockBin);
//   const [requests, setRequests] = useState(mockBin.requests);

//   useEffect(() => {
//     // if (!binRoute) return;
//     // const token = localStorage.getItem(`basket_${binRoute}`);
//     // if (!token) return;
//     getBin(binRoute, "").then((data) => {
//       setBin(data);
//       setRequests(data.requests);
//     }).catch((error) => {
//     console.error("getBin failed:", error);
//   });
// }, []);

//   return (
//     <section>
//       <Link to="/">Back to bins</Link>
//       <p>Bin Route: {bin.bin_route}</p>
//       <p>Send URL: {bin.send_url}</p>
//       {requests.map((request) => (
//         <div
//           key={request.id}
//           style={{
//             display: "flex",
//             borderBottom: "1px solid #ccc",
//             padding: "10px 0",
//           }}
//         >
//           <div style={{ width: "20%" }}>
//             <p>{request.method}</p>
//             <p>{request.created_at}</p>
//           </div>
//           <div style={{ width: "80%" }}>
//             <p>{request.path}</p>
//             <p>Headers: {JSON.stringify(request.headers)}</p>
//             <p>Body: {request.body.raw}</p>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// };
// export default BinViewPage;
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBin } from './BinViewService';

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500",
  POST: "bg-indigo-600",
  PUT: "bg-amber-500",
  PATCH: "bg-orange-500",
  DELETE: "bg-red-500",
};

const BinViewPage = () => {
  const { binRoute } = useParams<{ binRoute: string }>();

  const mockBin = {
    bin_route: "abc123",
    send_url: "/in/abc123",
    requests: [
      {
        id: 1,
        method: "POST",
        path: "/in/abc123",
        created_at: "2026-03-08 10:00:00",
        headers: { "content-type": "application/json", "user-agent": "Webhook-Service/1.0" },
        body: { raw: '{"event": "payment.succeeded", "data": {"id": "pay_9k2m1n0p", "amount": 4900}}' }
      },
      {
        id: 2,
        method: "GET",
        path: "/in/abc123",
        created_at: "2026-03-08 09:45:00",
        headers: { accept: "*/*" },
        body: { raw: "" }
      }
    ]
  };

  const [bin, setBin] = useState(mockBin);
  const [requests, setRequests] = useState(mockBin.requests);

  useEffect(() => {
    if (!binRoute) return;
    const token = localStorage.getItem(`basket_${binRoute}`);
    if (!token) return;
    getBin(binRoute, token).then(data => {
      setBin(data);
      setRequests(data.requests);
    }).catch((error) => {
      console.error("getBin failed:", error);
    });
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12" style={{ backgroundColor: "#f7f9fb" }}>

      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center gap-2 mb-10">
        <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-bold text-gray-800 text-lg">Webhook Inspector</span>
        <div className="ml-auto">
          <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to bins
          </Link>
        </div>
      </header>

      {/* Title + status */}
      <div className="max-w-7xl mx-auto flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Incoming Requests</h1>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 text-[11px] font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Listening
        </div>
      </div>

      {/* Bin info */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center gap-3">
        <span className="text-sm text-gray-500">Bin Route: {bin.bin_route}</span>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-500">Send URL:</span>
        <span className="font-mono text-sm text-indigo-600 font-medium">{bin.send_url}</span>
        <button
          className="text-gray-300 hover:text-gray-500 transition-colors"
          onClick={() => navigator.clipboard.writeText(bin.send_url)}
          title="Copy send URL"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Request list */}
      <main className="max-w-7xl mx-auto space-y-16">
        {requests.map(request => (
          <article key={request.id} className="flex flex-col md:flex-row gap-8">

            {/* Left: method + timestamp */}
            <div className="md:w-48 flex-shrink-0 pt-2">
              <span className={`inline-block px-2 py-0.5 ${methodColors[request.method] ?? "bg-gray-500"} text-white text-[10px] font-black rounded-sm mb-2`}>
                {request.method}
              </span>
              <div className="text-[13px] font-bold text-gray-800">{request.created_at}</div>
            </div>

            {/* Right: details */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">

              {/* Path */}
              <section className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">URL / Path</h3>
                <span className="text-indigo-600 font-mono text-sm font-medium">{request.path}</span>
              </section>

              {/* Headers */}
              <section className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Request Headers</h3>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2.5 border-b border-gray-100">Key</th>
                        <th className="px-4 py-2.5 border-b border-gray-100">Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {Object.entries(request.headers).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-50 last:border-0">
                          <td className="px-4 py-2.5">{key}</td>
                          <td className="px-4 py-2.5 font-mono text-gray-500 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Body */}
              {request.body.raw && (
                <section>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Request Body</h3>
                  <div className="bg-[#111827] rounded-xl p-6 overflow-x-auto">
                    <pre className="font-mono text-[13px] leading-relaxed text-gray-100">{request.body.raw}</pre>
                  </div>
                </section>
              )}

            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default BinViewPage;
