import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerDetails = () => {
  const initialCustomerState = {
    customername: "",
    email: "",
    phoneno: "",
    id: "",
  };

  const initialErrorState = {
    customername: "",
    email: "",
    phoneno: "",
  };

  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState(initialCustomerState);
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [errors, setErrors] = useState(initialErrorState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value,
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch("https://localhost:44375/api/customers");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(initialErrorState);
    let newErrors = {};

    Object.keys(customer).forEach((field) => {
      if (!customer[field] && field !== "id") {
        newErrors[field] = `${field} cannot be empty.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setIsOpen(!isOpen);

    if (!customer.id) {
      try {
        const response = await fetch("https://localhost:44375/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        });

        if (!response.ok) {
          throw new Error("Failed to submit data");
        }

        const result = await response.text();
        if (result) {
          console.log("Customer added:", JSON.parse(result));
          toast.success("Customer Added!");
        }
        setRefresh(!refresh);
        setCustomer(initialCustomerState);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          `https://localhost:44375/api/customers/${customer.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customer),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit data");
        }
        toast.success("Customer Updated!");
        setRefresh(!refresh);
        setCustomer(initialCustomerState);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(
        `https://localhost:44375/api/customers/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      toast.error("Customer Deleted!");
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    setCustomer({
      customername: data[edit]?.CustomerName,
      email: data[edit]?.Email,
      phoneno: data[edit]?.PhoneNo,
      id: data[edit]?.CustomerID,
    });
    if (edit) {
      setIsOpen(true);
    }
  }, [edit]);

  return (
    <div>
      <div className="flex items-start justify-center flex-col py-[25px] px-[50px]">
        <Button
          className="rounded bg-blue-500 py-2 px-4 text-sm text-white data-[hover]:bg-blue-600 data-[active]:bg-blue-700 mb-3"
          onClick={() => {
            setCustomer(initialCustomerState);
            setErrors(initialErrorState);
            setIsOpen(true);
          }}
        >
          Add Customer
        </Button>
        <ToastContainer />
        <DataTable
          customerData={data}
          setEdit={setEdit}
          deleteCustomer={deleteCustomer}
        />
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-start justify-center p-4 overflow-y-scroll">
            <DialogPanel className="max-w-3xl min-w-[500px] space-y-4 border bg-white border-2 border-gray-300 p-12 text-black rounded-[8px]">
              <DialogTitle className="font-bold capitalize">
                {customer.id ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black">
                    Name
                  </label>
                  <input
                    name="customername"
                    type="text"
                    value={customer.customername}
                    placeholder="john"
                    onChange={handleChange}
                    className="rounded-sm p-1 mt-1 w-full text-sm text-black border border-gray-300 focus:outline-none"
                  />
                  {errors.customername && (
                    <p style={{ color: "red" }}>{errors.customername}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={customer.email}
                    placeholder="dummy@mail.com"
                    onChange={handleChange}
                    className="rounded-sm p-1 mt-1 w-full text-sm text-black border border-gray-300 focus:outline-none"
                  />
                  {errors.email && (
                    <p style={{ color: "red" }}>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">
                    Phone Number
                  </label>
                  <input
                    name="phoneno"
                    type="tel"
                    value={customer.phoneno}
                    placeholder="3456789"
                    onChange={handleChange}
                    className="rounded-sm p-1 mt-1 w-full text-sm text-black border border-gray-300 focus:outline-none"
                  />
                  {errors.phoneno && (
                    <p style={{ color: "red" }}>{errors.phoneno}</p>
                  )}
                </div>
              </form>
              <div className="flex gap-4">
                <button
                  className="rounded bg-neutral-500 py-2 px-4 text-sm text-white data-[hover]:bg-blue-600 data-[active]:bg-blue-700 mb-3"
                  onClick={() => {
                    setEdit(null);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-blue-500 py-2 px-4 text-sm text-white data-[hover]:bg-blue-600 data-[active]:bg-blue-700 mb-3"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerDetails;
