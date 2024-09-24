import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllFreeResource = () => {
  const [freeResources, setFreeResources] = useState([]);
  const [categoryName, serCategoryName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch Free Resources
  const fetchFreeResources = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-free-resource');
      const reverse = res.data.data.reverse();
      setFreeResources(reverse);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching free resources:', error);
      toast.error('Failed to fetch free resources.');
      setLoading(false);
    }
  };

  // Fetch Free Resources
  const fetchCategoryName = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-free-resource-category');
      serCategoryName(res.data.data);
    //   setLoading(false);
    } catch (error) {
      console.error('Error fetching free resources:', error);
      toast.error('Failed to fetch free resources.');
      setLoading(false);
    }
  };

  // Delete Free Resource
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
          await axios.delete(`https://www.api.panandacademy.com/api/v1/delete-free-resource/${id}`);
          toast.success('Free resource deleted successfully');
          fetchFreeResources();
          Swal.fire('Deleted!', 'Your free resource has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting free resource:', error);
          toast.error('Failed to delete free resource.');
        }
      }
    });
  };

  const getCategoryNameById = (categoryId) => {
    const foundCategory = categoryName.find(cat => cat._id === categoryId);
    return foundCategory ? foundCategory.name : "No Category";
};

  // Handle Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = freeResources.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchCategoryName();
    fetchFreeResources();
  }, []);

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>All Free Resources</h4>
        </div>
        <div className="links">
          <Link to="/add-free-resource" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="d-table-h">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Name</th>
                <th scope="col">Category Name</th>
                <th scope="col">PDF</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((resource, index) => (
                <tr key={resource._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{resource.name}</td>
                  <td>{getCategoryNameById(resource.categoryId)}</td>
                  <td>
                    <a href={resource.FreePDF.url} target="_blank" rel="noopener noreferrer">View PDF</a>
                  </td>
                  <td>
                    <Link to={`/edit-free-resource/${resource._id}`}>
                      <button className="btn btn-info">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(resource._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from(
                { length: Math.ceil(freeResources.length / itemsPerPage) },
                (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </section>
      )}
    </>
  );
};

export default AllFreeResource;
