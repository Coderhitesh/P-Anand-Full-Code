import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const AllGalleryCategoryName = () => {
  const [categories, setCategories] = useState([]);

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 8;

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://api.panandacademy.com/api/v1/get-all-gallery-category-name');
      const reverseData = res.data.data;
      const main = reverseData.reverse();
      setCategories(main);
      console.log(categories);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- Pagination ---
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`https://api.panandacademy.com/api/v1/delete-gallery-category-name/${id}`);
          console.log(res.data);
          toast.success('Category Deleted Successfully');
          fetchCategories();

          Swal.fire({
            title: 'Deleted!',
            text: 'Your category has been deleted.',
            icon: 'success',
          });
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || 'Failed to delete the category.');
        }
      }
    });
  };

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>All Gallery Categories</h4>
        </div>
        <div className="links">
          <Link to="/add-gallery-name" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="d-table-h">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Category Name</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr key={category._id}>
                <th scope="row">{index + 1}</th>
                <td>{category.name}</td>
                <td>
                  <Link to={`/edit-gallery-name/${category._id}`} className="bt edit">
                    Edit <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </td>
                <td>
                  <Link onClick={() => handleDelete(category._id)} className="bt delete">
                    Delete <i className="fa-solid fa-trash"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(categories.length / itemPerPage) }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  );
};

export default AllGalleryCategoryName;
