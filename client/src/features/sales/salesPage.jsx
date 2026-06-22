import React, { useState, useEffect } from 'react';
import SalesEntryTable from './components/salesentrytable';
import { LuShoppingCart } from "react-icons/lu";
import { IoMdDocument } from "react-icons/io";
import Dropdown from '../../common/Dropdown/Dropdown';
import Input from '../../common/ui/input';
import DatePicker from '../../common/ui/datepicker';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../../services/api';
import ConfirmationDialog from '../../common/Dialogues/submitDialogue';
import FlashMessage from '../../common/Dialogues/FlashMessage';
import { values } from 'lodash';
import WarnMsg from '../../common/Dialogues/warnMsg';

//Custom CSS for unique design elements
const styles = `
  .sales-page-container {
    background: linear-gradient(145deg, #e5e7eb 0%, #d1d5db 100%);
    min-height: 100vh;
    padding: 2rem;
    border-radius: 16px;
  }

  .header {
    background: linear-gradient(90deg, #2dd4bf 0%, #a78bfa 100%);
    border-radius: 12px;
    padding: 1.25rem 1.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  .header-icon {
    color: #ffffff;
    font-size: 1.75rem;
    transition: transform 0.3s ease;
  }

  .header-icon:hover {
    transform: scale(1.2);
  }

  .header-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-section {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.75rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
  }

  .form-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4b5563;
    letter-spacing: 0.03em;
    transition: color 0.3s ease;
  }

  .form-group:hover .form-label {
    color: #fb7185;
  }

  .input-container {
    position: relative;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    border-radius: 8px;
    background: #ffffff;
    padding: 0.25rem;
  }

  .input-container:hover {
    border-color: #2dd4bf;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .submit-button {
    background: linear-gradient(90deg, #fb7185 0%, #a78bfa 100%);
    color: #ffffff;
    font-weight: 600;
    padding: 0.75rem 2.5rem;
    border-radius: 9999px;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 9rem;
    text-align: center;
    border: none;
  }

  .submit-button:hover:not(:disabled) {
    background: linear-gradient(90deg, #f43f5e 0%, #8b5cf6 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .table-container {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-top: 2.5rem;
    border: 1px solid #e5e7eb;
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .sales-page-container {
      padding: 1rem;
    }

    .header-title {
      font-size: 1.5rem;
    }
  }
`;

export default function SalesPage({ editData, editMain, icon, title = "Create Sales Order" }) {
  const [tableKey, setTableKey] = useState(0);
  const [flash, setFlash] = useState(null);
  const [productItems, setProductItems] = useState([]);
  const [paCodeOptions, setPaCodeOptions] = useState([]);
  const [paTypes, setPaTypes] = useState([]);
  const [paNamesOptions,setPanamesOptions] = useState([]);
  const [paCreditTerms, setPacreditTerms] = useState([]);
  const [soNumber, setSoNumber] = useState("");
  const [empName,setEmpName] = useState([]);
  const [time,setTime] = useState("");
  const [date,setDate] = useState("");
  const [submiting,setSubmiting] = useState(false);
  const [confirmOpen,setConfirmOpen] = useState(false);
  const [allData,setAllData] = useState([]);
  const [selectedPaCode,setSelectedPaCode] = useState(null);
  const [selectedPaType,setSelectedPaType] = useState(null);
  const [selectedPaName, setSelectedPaName] = useState(null);
  const [selectedEmpName, setSelectedEmpName] = useState(null);
  const [selectedPacredit, setSelectedPacredit] = useState(null);
  const [manualPaNameSelection, setManualPaNameSelection] = useState(false);
  const [editCheckDone, setEditCheckDone] = useState(false);
  const [editChecked, setEditChecked] = useState(false)
  const [yearCode, setYearCode] = useState(null)
  const [paCredit ,setPaCredit]=useState("")
  const isEditMode = !!editMain;
  const [isWarning ,setIswarning]=useState(false)
  //console.log(selectedEmpName)

useEffect(()=>{
      const handleCheckEmpCus=async()=>{
            //  setSelectedEmpName(null)
            //  setSelectedPaCode(null)
              try{
                const res=await api.get(`cus-emp-check/?empno=${selectedEmpName.value}&pacode=${selectedPaCode.value}`)
                //console.log(res.data)
                if(res.data.warning){                    
                    console.log(res.data.warning)
                    setIswarning(true)
                }
              }catch(err){
                     console.log(err.response.data)
                    //  if(err.response.data.warning){
                    //    
                    //  }
              }     

              
              
      }

      if (selectedEmpName?.value && selectedPaCode?.value) {
        handleCheckEmpCus();
      }
},[selectedEmpName ,selectedPaCode])


  useEffect(() => {
    setSelectedEmpName(editMain?.soEmpNo);
    setSelectedPaCode({ label: editMain?.PaCode, value: editMain?.PaCode });
    setSelectedPaName({ label: editMain?.PaName, value: editMain?.PaName });
    setSelectedPacredit({ label: editMain?.PaCreditTerms, value: editMain?.PaCreditTerms });
  }, [editMain]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;

    if (editMain?.soDate) {
      setDate(editMain.soDate);
      setEditChecked(true);
    } else if (!editMain && !editChecked) {
      timer = setTimeout(() => {
        const now = new Date();
        const formattedDate = now.toLocaleDateString("en-GB");
        setDate(formattedDate);
        setEditChecked(true);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [editMain, editChecked]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [party, employee] = await Promise.all([
          api.get("/party-list/"),
          api.get("/employee")
        ]);
        const data = party.data.data;
        const emp = employee.data.data;
        setAllData(data);

        const uniquePaTypes = [
          ...new Set(data.map((item) => item.PaType)),
        ].map((v) => ({ label: v, value: v }));

        const uniquePaCodes = [
          ...new Set(data.map((item) => item.PaCode))
        ].map((code) => ({ label: code, value: code }));

        const uniquePaNames = [
          ...new Set(data.map((item) => item.PaName)),
        ].map((name) => ({ label: name, value: name }));

        const uniquePacreditTerms = [
          ...new Set(data.map((item) => item.PaCreditTerms)),
        ].map((name) => ({ label: name, value: name }));

        const uniqueEmpNames = emp?.map(item => ({
          label: item.EmpName,
          value: item.EmpNo
        }));

        setPaTypes(uniquePaTypes);
        setPaCodeOptions(uniquePaCodes);
        setPanamesOptions(uniquePaNames);
        setPacreditTerms(uniquePacreditTerms);
        if (uniquePacreditTerms.length === 1) {
          setSelectedPacredit(uniquePacreditTerms[0]);
        }
        setEmpName(uniqueEmpNames);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      }
    };

    fetchData();
  }, []);


      const fetchSONumber = async (date) => {
        const yearCode = getYearCode(date || new Date());
        if (!yearCode) return;

        try {
            const response = await api.get(`/generate-so-number/${yearCode}/`);
            const nextNo = response.data?.nextSoNo;
            if (nextNo !== undefined) {
                setFormData(prev => ({ ...prev, soNo: nextNo.toString() }));
            }
        } catch (err) {
            console.error("Failed to fetch next SO Number", err);
        } finally {
            console.log("NextNo API call finished");

        }
      }


  const fetchSONumber1 = async () => {
    try {       

      
      const res = await api.get("/generate-so-number/", {
        params: {          
          SoYearCode: yearCodeToUse          
        }
      
      
      });

      if (res.data.status) {
        setSoNumber(res.data.so_number);
      } else {
        console.error("Failed to fetch SO Number:", res.data.error);
      }
    } catch (error) {
      console.error("Error fetching SO Number:", error);
    }
  }

  const getCreditTerms = async (paCode) => {
    try {
      const response = await api.get(`/credit-terms/${selectedPaCode?.value}/`)
      //return response.data;
      //console.log("credit",response)
      if(response.status===200){
        const paCreditTerms = response.data?.PaCreditTerms
        //if it has a value,use it; otherwise store 0
      setPaCredit(paCreditTerms ? paCreditTerms : "0");
      }      
    } catch(error){
      console.error("Error fetching credit terms:",error);
      //throw error;
    }
  }

useEffect(()=>{
    getCreditTerms()

},[selectedPaCode?.value])

  useEffect(() => {
    let timer;

    if (editMain) {
      setSoNumber(editMain.soNo || "");
      setEditCheckDone(true);
    } else if (!editCheckDone) {
      timer = setTimeout(() => {
        if (!editMain) {
          fetchSONumber(setDate( editMain.soDate || new Date()));
          setEditCheckDone(true);
        }
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [editMain, editCheckDone]);

  const handlePaCodeChange = (code) => {
    setSelectedPaCode(code);
    setManualPaNameSelection(false);
  };

  useEffect(() => {
    const allUniqueNames = [...new Set(allData.map(item => item.PaName))];

    const mapped = selectedPaCode
      ? allData.filter(item => item.PaCode === selectedPaCode.value)
      : [];

    const mappedNames = mapped.map(item => item.PaName);

    const options = allUniqueNames.map(name => ({
      label: name,
      value: name,
      isMapped: mappedNames.includes(name),
    }));

    const sortedOptions = selectedPaCode
      ? options.sort((a, b) => (b.isMapped ? 1 : -1))
      : options;

    setPanamesOptions(sortedOptions);

    if (selectedPaCode && !manualPaNameSelection && mappedNames.length > 0) {
      setSelectedPaName({ label: mappedNames[0], value: mappedNames[0] });
    }
  }, [selectedPaCode, allData]);

  useEffect(() => {
    if (!selectedPaName) return;
    const match = allData.find(item => item.PaName === selectedPaName.value);
    if (match) {
      setSelectedPaCode({ label: match.PaCode, value: match.PaCode });
      setManualPaNameSelection(true);
    }
  }, [selectedPaName, allData]);

  const handleProductChangeAdd = (items) => {
    setProductItems(items);
  };

  const getFinancialYearCode = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    let fyStart, fyEnd

    if (month >= 4) {
      // April to December
      fyStart = year % 100;
      fyEnd = (year + 1) % 100;
    } else {
      // January to March
      fyStart = (year-1) %100;
      fyEnd = year % 100;
    }

    return `${fyStart}${fyEnd}`; //format:2526
  };

  useEffect(() => {
    const code = getFinancialYearCode();
    setYearCode(code); // store in state on initial render
  }, []);

  const handleSubmit = async () => {
    setSubmiting(true);
    try {
      if (!selectedPaCode || !selectedPaName || !selectedEmpName || productItems.length === 0) {
        alert("Please fill all required fields.");
        return;
      }

      const mainPayload = {
        soNo: soNumber,
        soYearCode:yearCode,
        PaCode: selectedPaCode.value,
        soDate: parseDDMMYYYY(date)?.toISOString(),
        soEmpNo: selectedEmpName.value,
        SoPreparedTime: new Date().toISOString(),
        // PaCreditTerms: selectedPacredit?.value || "",
        PaCreditTerms:paCredit
      };

      const updatedProductItems = productItems.map((item) => ({
        ...item,
        SoNo: soNumber,
        soYearCode:yearCode,
      }));

      const payload = {
        trso_main:mainPayload,
        trso_sub:updatedProductItems
      };

      let res;

      if (editMain) {
        res = await api.put(`/sales-entry-update/${soNumber}/`, payload);
      } else {
        res = await api.post("/sales-entry/", payload);
      }

      if (res.status === 200 || res.status === 201) {
        setFlash({
          type: "success",
          title: editMain ? "Order Updated" : "Order Submitted",
          message: editMain
            ?"Sales order has been successfully updated."
            :"Sales order has been successfully saved.",
        });

        setConfirmOpen(false);
        setSubmiting(false);
        if (editMain) {
          window.location.href = "/orderlist";
        } else {
          setSelectedPaCode(null);
          setSelectedPaName(null);
          setSelectedPaType(null);
          setSelectedEmpName(null);
          setSelectedPacredit(null);
          setManualPaNameSelection(false);
          setProductItems([]);
          setTableKey(prev => prev + 1);
          setDate(new Date().toLocaleDateString("en-GB"));
          setTime(new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }));
          fetchSONumber(setDate( editMain.soDate || new Date()));
        }
      } else {
        setFlash({
          type: "error",
          title: "Error",
          message: "Please try again later.",
        });
      }
    } catch (err) {
      console.log(err)
      setFlash({
        type: "error",
        title: "Error",
        message: "Something went wrong while submitting.",
      });
    } finally {
      setSubmiting(false);
      setConfirmOpen(false);
    }
  };

  function parseDDMMYYYY(dateStr) {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(+year, +month - 1, +day);
  }

  return (
    <>
      <style>{styles}</style>
      <div className="sales-page-container">
        <div className="header">
          <span className="header-icon">{editMain ? icon : <IoMdDocument />}</span>
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <span className="form-label">SO.NO</span>
              <div className="input-container">
                <Input placeholder="SO Number" value={soNumber} readOnly />
              
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">SO Date</span>
              <div className="input-container">
                <DatePicker value={parseDDMMYYYY(editMain?.soDate)} />
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">Prepared Time</span>
              <div className="input-container">
                <Input placeholder="Enter Time" value={time} readOnly />
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">Sales Person Name</span>
              <div className="input-container">
                <Dropdown
                  value={selectedEmpName}
                  onChange={setSelectedEmpName}
                  options={empName}
                />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <span className="form-label">Customer Code</span>
              <div className="input-container">
                <Dropdown
                  value={selectedPaCode}
                  onChange={handlePaCodeChange}
                  options={paCodeOptions}
                />
               
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">Customer Name</span>
              <div className="input-container">
                <Dropdown
                  value={selectedPaName}
                  onChange={setSelectedPaName}
                  options={paNamesOptions}
                />
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">Payment Terms</span>
              <div className="input-container">
                {/* <Dropdown
                  options={paCreditTerms}
                  value={selectedPacredit}
                  onChange={setSelectedPacredit}
                /> */}
                  <input 
                  value={paCredit}
                  onChange={(e)=>setPaCredit(e.target.value)}
                 className='py-1  pl-1 rounded-md  outline-0  border-1 border-gray-300 w-full'></input>
              </div>
            </div>
          </div>
        </div>

        <div className="table-container">
           <SalesEntryTable
            pacode={selectedPaCode}
            editData={editData}
            onProductChange={handleProductChangeAdd}
            key={tableKey}
          /> 
          <div className="flex justify-center xl:justify-end p-5">
            <button
              disabled={submiting}
              onClick={() => setConfirmOpen(true)}
              className="submit-button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        loading={submiting}
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
        buttonText="Submit"
        title="Confirm Submission"
        message="Are you sure you want to submit this Sales Order?"
      />

      {flash && (
        <FlashMessage
          type={flash.type}
          title={flash.title}
          message={flash.message}
          buttonText="OK"
          onClose={() => setFlash(null)}
          onAction={() => setFlash(null)}
        />
      )}

         <WarnMsg  open={isWarning} onClose={()=>setIswarning(false)}/>
    </>
  )
      }
    
