import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

const AllFaq = () => {
  const [faqs, setFaqs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 8;

  const handleFetch = async () => {
    try {
      const res = await axios.get(`https://www.api.panandacademy.com/api/v1/get-all-faq`);
      const reversed = res.data.data.reverse();
      setFaqs(reversed);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to fetch FAQs');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://www.api.panandacademy.com/api/v1/delete-faq/${id}`);
          toast.success("FAQ deleted successfully");
          handleFetch();
          Swal.fire("Deleted!", "The FAQ has been deleted.", "success");
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete FAQ");
        }
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      <Toaster />
      <div className="bread">
        <div className="head">
          <h4>All FAQs</h4>
        </div>
        <div className="links">
          <Link to="/add-faq" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="d-table-h">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((faq, index) => (
              <tr key={faq._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{faq.question}</td>
                <td>{faq.answer}</td>
                <td>
                  <Link to={`/edit-faq/${faq._id}`} className="bt edit">
                    Edit <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </td>
                <td>
                  <button
                    className="bt delete"
                    onClick={() => handleDelete(faq._id)}
                  >
                    Delete <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.ceil(faqs.length / itemPerPage) }, (_, i) => (
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

export default AllFaq;
