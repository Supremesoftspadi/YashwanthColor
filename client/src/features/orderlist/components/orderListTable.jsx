"use client";
import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import axios from 'axios';
import { CiViewList } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";
import DatePicker from '../../../common/ui/datepicker';
import { useNavigate } from 'react-router-dom';
//import OrderListEdit from './editorderList';
import EditorderList from './editorderList';
import api from '../../../services/api';
import { ImPrinter } from "react-icons/im";
import FlashMessage from '../../../common/Dialogues/FlashMessage';
import ConfirmationDialog from '../../../common/Dialogues/submitDialogue'
// import InvoiceTemplate from '../../invoice/invoiceTemp';
// import { fetchInvoiceData } from '../../../services/fetchIvoicedata';
// import InvoiceWrapper from '../../invoice/InvoiceWrapper';

const getWeekRange = () => {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + (day === 0 ? -6 : 1));
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday }
};

export default function OrderListTable() {
  const { monday, sunday } = getWeekRange();
  const [filteredData, setFilteredData] = useState([]);  //data store
  const [loading, setLoading] = useState(true)
  const [soNo, setSoNo] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)  //data clicked view icon
  const [isDialogOpen, setIsDialogOpen] = useState(false)   //for list 
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)  //for editis 
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteSoNo, setDeleteSoNo] = useState(null)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [editOrder, setEditOrder] = useState(null)
  const [fromDate, setFromDate] = useState(monday)
  const [toDate, setToDate] = useState(sunday)
  const [subItem, setSubItem] = useState([])
  const [subItemLoading, setSubItemLoading] = useState(false)
  const [editRows, setEditRows] = useState([])

  const [showFlash, setFlash] = useState(false)
  const [mainData, setMainData] = useState(null);       // soMain data
  const [subItems, setSubItems] = useState([]);         // soSub data
  const [companyInfo, setCompanyInfo] = useState(null)
  const [printsoNo, setPrintSono] = useState(null)

  const [initialFilters, setInitialFilters] = useState({    ///for diable reset button 
    fromDate: monday,
    toDate: sunday,
    soNo: ''
  });
  let navigate = useNavigate();

  //console.log("editmain",editOrder)
  //console.log("editsub", editRows)

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const isFilterChanged =
    format(fromDate, 'yyyy-MM-dd') !== format(initialFilters.fromDate, 'yyyy-MM-dd') ||
    format(toDate, 'yyyy-MM-dd') !== format(initialFilters.toDate, 'yyyy-MM-dd') ||
    soNo.trim() !== initialFilters.soNo

  const handleView = async (order) => { ///fetch sub data   of clicking view icon
    setSelectedOrder(order)
    setIsDialogOpen(true)
    setSubItemLoading(true);
    try {
      const res = await api.get(`/sub-items/${order.soNo}/`);
      const subItems = res.data?.data || [];
      setSubItem(subItems)
    } catch (error) {
      console.error("Failed to fetch sub-items:", error);
    } finally {
      setSubItemLoading(false);
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedOrder(null)

  }

  const handleEdit = async (order) => {
    //console.log("soNo",order)


    navigate (`/editorderbysono/${order.soNo}`)
    // setEditOrder(null);
    // setIsEditDialogOpen(true); // Open immediately (optional loading UX)
    // try {
    //   const res = await api.get(`/sales-entry-detail/${order.soNo}/`);
    //   const { trsomain, trsosub } = res.data;
    //   console.log(trsosub)
    //   // Transform trsomain to form format
    //   setEditOrder({
    //     ...trsomain,
    //     soDate: formatDate(trsomain.soDate),
    //     SoPreparedTime: formatDate(trsomain.SoPreparedTime),
    //     PaCode: trsomain.PaCode,
    //     PaName: trsomain.PaName,
    //     PaCreditTerms: trsomain.PaCreditTerms,
    //     soEmpNo: { label: trsomain.EmpName, value: trsomain.soEmpNo }
    //   });

    //   // Transform trsosub for your editable table
    //   const transformedSubItems = trsosub.map(item => ({
    //     prcode: item.PrCode,
    //     productName: item.PrName,
    //     packing: item.soSpecification,
    //     particular: item.soParticular,
    //     uom: item.soUOM,
    //     quantity: item.soQty,
    //     rate: item.soRate,
    //     discount: item.soDiscount,
    //     taxType: item.TaxType,
    //     taxAmount: item.soTaxAmt,
    //     //amount: item.soAmount,
    //     //subTotal: item.soTotalAmount,
    //     deliveryPref: item.SoDeliveryPreference,
    //     deliveryDate: item.SoDeliveryDate
    //   }));

    //   setEditRows(transformedSubItems);
    // } catch (err) {
    //   console.error("Failed to fetch order data for editing:", err);
    //   toast.error("Unable to load sales order.");
    // }
  };


  const getOrderData = async () => {    //fetch curent week data default
    setLoading(true)
    try {
      const res = await api.get('/current-week-sales/')
      if (res?.status === 200) {
        const data = res?.data
        //console.log(data)
        const trmainValues = data?.map(item => ({ ...item, PaCode: item.PaCode?.trim(), })).sort((a, b) => b.soNo - a.soNo)


        setFilteredData(trmainValues)
      }
    } catch (err) {
      console.log('API Error:', err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderData();
    setInitialFilters({
      fromDate: monday,
      toDate: sunday,
      soNo: ''
    });
  }, []);


  const handleSearch = async () => {    ///for filter data by date
    if (!fromDate || !toDate) return

    const from = fromDate.toISOString().split("T")[0]
    const to = toDate.toISOString().split("T")[0]
    const trimmedSoNo = soNo.trim()
    setLoading(true)
    try {
      const res = await api.get("/sales-filter-list/", {
        params: {
          from_date: from,
          to_date: to,
          ...(trimmedSoNo && { soNo: trimmedSoNo }), // only add if soNo exists
        }
      })

      if (res?.data?.status) {
        const cleaned = res.data.data?.map((item) => ({ ...item, PaCode: item.PaCode?.trim(), })).sort((a, b) => a.soNo - b.soNo)
        setFilteredData(cleaned);
      } else {
        setFilteredData([]);
      }
    } catch (err) {
      console.error("Search API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {       //reset button
    const { monday, sunday } = getWeekRange()
    setSoNo("")
    getOrderData()
    setInitialFilters({ fromDate: monday, toDate: sunday, soNo: '' })
    setFromDate(monday)
    setToDate(sunday)
  }


  const handleDelete = async () => {
    console.log(deleteSoNo)

    try {
      setLoading(true)
      const response = await api.delete(`/delete-sales/${deleteSoNo}`)
      console.log(response)
      setIsDeleteDialogOpen(false);
      if (response.status === 204) {
        setFlash(true)
        handleSearch()
      }



    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  const totalAmount = Number(subItem?.reduce((sum, item) => {
    const qty = Number(item.soQty || 0);
    const rate = Number(item.soRate || 0);
    const discount = Number(item.soDiscount || 0);
    const taxAmt = Number(item.soTaxAmt || 0);

    const baseAmount = qty * rate;
    const discountAmount = baseAmount * (discount / 100);
    const total = baseAmount - discountAmount + taxAmt;
    console.log(taxAmt, baseAmount, discountAmount)
    return sum + total;
  }, 0).toFixed(2));


  return (

    <>
      <div className='border-0 p-0 flex flex-col gap-y-1'>

        <div className='mt-1 px-2 sm:px-4 py-2 min-h-[200px]'>
          <h1 className="text-md text-gray-400 font-semibold mb-2">Search Orders by Date Range</h1>
          <div className="flex flex-col gap-y-4 sm:flex-row  sm:gap-x-2 w-full border-0">

            <div className="flex flex-col  w-full sm:w-[30%] border-0">
              <label className="text-sm font-medium">From Date</label>
              <div className="w-full">
                <DatePicker value={fromDate} onChange={setFromDate} />
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-[30%] border-0 ">
              <label className="text-sm font-medium">To Date</label>
              <div className="w-full ">
                <DatePicker value={toDate} onChange={setToDate} />
              </div>
            </div>

            <div className='mt-[1px] flex flex-col w-full sm:w-[30%]'>
              <label className="text-sm font-medium">SO No</label>
              <input
                type="text"
                value={soNo}
                onChange={(e) => setSoNo(e.target.value)}
                placeholder="Enter SO No"
                className=" w-full  border-1 px-2 py-1 rounded-md"
              />
            </div>

            <div className="flex gap-x-3">
              <button
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full mt-[18px] hover:cursor-pointer outline-0"
              >
                Search
              </button>



              <button
                onClick={handleReset}
                disabled={!isFilterChanged}
                className={`px-4 py-1 mt-[18px] rounded-full font-bold text-white outline-0 ${isFilterChanged ? 'bg-red-500 hover:cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table Header */}

        <div className="w-full overflow-x-auto">
          <div className='min-w-[1000px] border-1 border-gray-100'>
            <div className="grid grid-cols-20 sm:grid-cols-20 gap-1 items-center text-center bg-gray-100 text-sm h-10 font-semibold">
              <div className="col-span-2 border-0 border-gray-300">So.No</div>
              <div className="col-span-3 border-0 border-gray-300">Date</div>
              <div className="col-span-3 border-0 border-gray-300">Customer Code</div>
              <div className="col-span-4 border-0 border-gray-300">Customer Name</div>
              <div className="col-span-2 border-0 border-gray-300">View</div>
              <div className="col-span-2 border-0 border-gray-300">Edit</div>
              <div className="col-span-2 border-0 border-gray-300">Delete</div>
              <div className="col-span-2 border-0 border-gray-300">Print</div>
            </div>

            {/* Table Data or Loading or No Data */}
            {loading ? (
              <div className="text-center py-4 text-blue-600 font-medium flex justify-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-red-500 font-medium">
                No data found for this date range.
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-20 gap-0 text-center items-center  border-b-1 border-b-gray-100 text-[16px] bg-white hover:bg-gray-50 py-2 font-semibold"
                >
                  <div className="col-span-2 border-r-0 border-gray-300 ">{item.soNo}</div>
                  <div className="col-span-3 border-r-0 border-gray-300">
                    {new Date(item.soDate).toLocaleDateString()}
                  </div>
                  <div className="col-span-3 border-r-0 border-gray-300">{item.PaCode}</div>
                  <div className="col-span-4 border-r-0 border-gray-300  text-left pl-3">{item.PaName}</div>
                  <div className="col-span-2 border-r-0 border-gray-300">
                    <button
                      className="bg-blue-500 text-white rounded-full p-2 cursor-pointer"
                      onClick={() => handleView(item)}
                    >
                      <CiViewList size={15} />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full hover:cursor-pointer">
                      <LiaEditSolid />
                    </button>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => {
                        setIsDeleteDialogOpen(true)
                        setDeleteSoNo(item.soNo)
                      }
                        //() => handleEdit(item)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full hover:cursor-pointer">
                      <AiOutlineDelete />
                    </button>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => navigate(`/orderprint/${item.soNo}`)}
                      //onClick={() => handlePrint(item.soNo)}
                      className="bg-blue-500  cursor-pointer text-white p-2 rounded-full">
                      <ImPrinter />
                    </button>
                  </div>
                </div>

              ))
            )}
          </div>
        </div>
        {/*dialog box for list the order deatils*/}
        {isDialogOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg w-[90%] max-w-7xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  SO No: {selectedOrder.soNo} - {selectedOrder.PaName}
                </h2>
                <button onClick={handleCloseDialog} className="text-white bg-blue-500 p-1 rounded-full hover:cursor-pointer">
                  <IoMdClose size={20} />
                </button>
              </div>

              {subItemLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ):
                subItem?.length > 0 ? (
                  <table className="w-full text-sm text-left border border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Product Code</th>
                        <th className="border p-2">Item Name</th>
                        <th className="border p-2">Particular</th>
                        <th className="border p-2">Specification</th>
                        <th className="border p-2">Qty</th>
                        <th className="border p-2">Rate</th>
                        <th className="border p-2">Discount</th>
                        <th className="border p-2">Tax</th>
                        <th className="border p-2">Tax Amount</th>
                        <th className='border p-2'>Total Amount</th>
                        <th className="border p-2">Delivery Date</th>
                        <th className="border p-2">Delivery Preference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subItem?.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="border p-2">{sub.PrCode}</td>
                          <td className="border p-2">{sub.PrName}</td>
                          <td className="border p-2">{sub.soParticular?.trim()}</td>
                          <td className="border p-2">{sub.soSpecification}</td>
                          <td className="border p-2">{sub.soQty}</td>
                          <td className="border p-2 text-right">₹{sub.soRate}</td>
                          <td className="border p-2">{sub.soDiscount}%</td>
                          <td className="border p-2">{sub.TaxType}</td>
                          <td className="border p-2 text-right">₹{sub.soTaxAmt}</td>
                          <td className="border p-2 text-right">₹{(Number(sub.soQty) * Number(sub.soRate) -
                            (Number(sub.soQty) * Number(sub.soRate) * Number(sub.soDiscount || 0) / 100) +
                            Number(sub.soTaxAmt || 0)).toFixed(2)}</td>
                          <td className="border p-2">{sub.SoDeliveryDate ? new Date(sub.SoDeliveryDate).toLocaleDateString() : '-'}</td>
                          <td className="border p-2">{sub.SoDeliveryPreference}</td>
                        </tr>
                      ))}

                      <tr className="border-t font-semibold">
                        <td colSpan={5} className="px-2 py-2 text-right">

                        </td>
                        <td className="px-2 py-2 text-center">{""}</td>
                        {/* <td className="px-2 py-2 text-right">₹{totalRate.toFixed(2)}</td> */}
                        <td className="px-2 py-2"></td>
                        <td className="px-2 py-2"> </td>
                        <td className="px-2 py-2 text-right">Total Amount</td>
                        <td className="px-2 py-2 text-right">₹ {totalAmount.toFixed(2)}</td>

                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">No sub-items found for this order.</p>
                )}
            </div>
          </div>
        )}

        {/* {isEditDialogOpen && (
          <EditorderList
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            soMain={editOrder}   //somain value
            soSub={editRows}   //sosubvalues
            setEditRows={setEditRows}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              getOrderData();
            }}
          />
        )} */}






      </div>
      <ConfirmationDialog isOpen={isDeleteDialogOpen}
        title="Delete Order"
        loading={loading}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        message="Are sure want to delete"
        buttonText="Delete" />


      {showFlash && (
        <FlashMessage
          type="error"
          title="Deleted"
          message="The record has been successfully deleted."
          buttonText="OK"

          onClose={() => setFlash(false)}
        />
      )}
    </>

  );
}
