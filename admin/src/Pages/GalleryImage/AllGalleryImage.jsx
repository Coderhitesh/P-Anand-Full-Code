import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllGalleryImage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 8;

  // Fetch Gallery Images
  const fetchGalleryImages = async () => {
    try {
      const res = await axios.get('https://www.api.panandacademy.com/api/v1/get-all-gallery-image');
      const reverse = res.data.data.reverse()
      setGalleryImages(reverse);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to fetch gallery images.');
      setLoading(false);
    }
  };

  // Delete Gallery Image
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
          await axios.delete(`https://www.api.panandacademy.com/api/v1/delete-gallery-image/${id}`);
          toast.success('Gallery image deleted successfully');
          fetchGalleryImages();
          Swal.fire('Deleted!', 'Your gallery image has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting image:', error);
          toast.error('Failed to delete gallery image.');
        }
      }
    });
  };

  // Handle Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = galleryImages.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>All Gallery Images</h4>
        </div>
        <div className="links">
          <Link to="/add-gallery-image" className="add-new">
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
                <th scope="col">Image</th>
                <th scope="col">Gallery Category</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((image, index) => (
                <tr key={image._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={image.image.url}
                      alt="gallery"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </td>
                  <td>
                    <GalleryCategoryName id={image.galleryCategoryId} />
                  </td>
                  <td>
                    <Link to={`/edit-gallery-image/${image._id}`}>
                      <button className="btn btn-info">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(image._id)}
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
                { length: Math.ceil(galleryImages.length / itemPerPage) },
                (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''
                      }`}
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

// Component to Fetch and Display Gallery Category Name by ID
const GalleryCategoryName = ({ id }) => {
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await axios.get(
          `https://www.api.panandacademy.com/api/v1/get-single-gallery-category-name/${id}`
        );
        setCategoryName(res.data.data.name);
        console.log(res.data.data.name)
      } catch (error) {
        console.error('Error fetching gallery category name:', error);
      }
    };
    fetchCategoryName();
  }, [id]);

  return <span>{categoryName || 'N/A'}</span>;
};

export default AllGalleryImage;
