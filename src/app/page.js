"use client"

import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    profileStatus: 'All',
    redemptionStatus: 'All',
    badgesCompleted: 'All',
  });
  const [summary, setSummary] = useState({
    totalParticipants: 0,
    totalCorrectParticipants: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/report.csv');
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);

      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data;
          setData(parsedData);
          setFilteredData(parsedData);

          const totalParticipants = parsedData.length;
          const totalCorrectParticipants = parsedData.filter(row => row['Profile URL Status'] === 'All Good').length;

          setSummary({ totalParticipants, totalCorrectParticipants });
        },
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    let result = data;

    if (searchTerm) {
      result = result.filter(row =>
        row['User Name']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.profileStatus !== 'All') {
      result = result.filter(row => row['Profile URL Status'] === filters.profileStatus);
    }
    if (filters.redemptionStatus !== 'All') {
      result = result.filter(row => row['Access Code Redemption Status'] === filters.redemptionStatus);
    }
    if (filters.badgesCompleted !== 'All') {
      result = result.filter(row => row['All Skill Badges & Games Completed'] === filters.badgesCompleted);
    }

    setFilteredData(result);
  }, [searchTerm, filters, data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GDGoC-AEC Google Cloud Study Jams 2025</h1>
          <p className="text-lg text-gray-600">Daily Progress Report</p>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Total Participants</h2>
            <p className="text-3xl font-bold">{summary.totalParticipants}</p>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Total Correct Participants</h2>
            <p className="text-3xl font-bold">{summary.totalCorrectParticipants}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by Name..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select name="profileStatus" onChange={handleFilterChange} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Profile Statuses</option>
              <option value="All Good">All Good</option>
              <option value="Wrong Google Cloud Skills Boost Public Profile URL">Wrong</option>
            </select>
            <select name="redemptionStatus" onChange={handleFilterChange} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Redemption Statuses</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <select name="badgesCompleted" onChange={handleFilterChange} className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">All Completion Statuses</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Badges Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Names of Completed Skill Badges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arcade Games Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Names of Completed Arcade Games</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{row['User Name']}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={row['Google Cloud Skills Boost Profile URL']} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Profile
                    </a>
                  </td>
                  {/* --- MODIFIED LOGIC HERE --- */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {row['Profile URL Status'] === 'Wrong Google Cloud Skills Boost Public Profile URL' 
                      ? 'Wrong' 
                      : row['Profile URL Status']}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{row['# of Skill Badges Completed']}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm">{row['Names of Completed Skill Badges']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">{row['# of Arcade Games Completed']}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm">{row['Names of Completed Arcade Games']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}