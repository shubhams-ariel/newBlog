import React, { useEffect, useState, type ChangeEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type User = {
  id: number;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
};

const RenderList: React.FC = () => {
  const [products, setProducts] = useState<User[]>([]);
  const [searchItem, setSearchItem] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetch('https://fakestoreapi.com/users')
      .then((res) => res.json())
      .then((data: User[]) => setProducts(data))
      .catch(() => toast.error('Error fetching users'));
  }, []);

  const handleDelete = (id: number) => {
    const updated = products.filter((item) => item.id !== id);
    setProducts(updated);
    toast.success('User deleted successfully!');
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((item) => {
    if (!searchItem) return true;
    const fullName = `${item.name.firstname} ${item.name.lastname}`.toLowerCase();
    return fullName.includes(searchItem.toLowerCase());
  });

  const totalPages = Math.ceil(filteredProducts.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + usersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100 ">
      <ToastContainer /> 
      <h1 className="text-2xl font-semibold mb-4">User List</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchItem}
        onChange={handleSearchChange}
        className="p-2 border rounded-sm mb-4 w-[17rem] max-w-md  "
      />

      {paginatedProducts.map((item) => (
        <div key={item.id} className="mb-2 p-5 bg-white shadow rounded">
            <div className='flex justify-between'>
              <ul>
                 <li className="font-bold">{item.name.firstname} {item.name.lastname}</li>
                <li>{item.phone}</li>
              
              </ul>
         
          <button
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-400 rounded text-white"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
          </div>
        </div>
      ))}

      

      {filteredProducts.length > usersPerPage && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RenderList;
