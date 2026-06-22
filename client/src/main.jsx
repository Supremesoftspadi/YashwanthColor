import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter,RouterProvider,  createMemoryRouter,} from "react-router-dom";
import { UserProvider } from './context/useContext.jsx';
import './index.css'
import App from './App.jsx'
import Navbar from './common/navbar/navbar.jsx';
import LoginPage from './features/auth/page/Loginpage.jsx';
import Sidebar from './common/sidebar/sidebar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './common/Layout/Layout.jsx';
import SalesPage from './features/sales/salesPage.jsx';
import OrderListPage from './features/orderlist/orderListPage.jsx';
import InvoiceTemplate from './features/invoice/invoiceTemp.jsx';
import InvoicePage from './features/invoice/invoicePage.jsx';
import PrintOrderpage from './features/sales/printOrder.jsx';
import OrdervsInvoice from './features/invoice/OrdervsInvoice.jsx';
import PrivateRoute from './common/Layout/PrivateRoute.jsx';
import InvoicevsOrderPage from './features/Report/invoicevsOrderPage.jsx';
import OutStandingReport from './features/Report/OutStandingReport.jsx';
import SalesVsPaymentPage from './features/Report/SalesVsPaymentPage.jsx';
import SalesvsPaymentRegister from './features/Report/SalesVsPaymentRegister.jsx';
import EditorderList from './features/orderlist/components/editorderList.jsx';
import ReportsPage from './features/Report/ReportsPage.jsx';
//createMemoryRouter
///createBrowserRouter
const router = createBrowserRouter([
  {
    path:"/login",
    element:<LoginPage/>
  },
  {
    element:<PrivateRoute/>,
    children:[
         {
           path:"/",
           element:<Layout/>,
           children:[
            {index:true,element:<App/>},
            {path:'/salesentry',element:<SalesPage/>},
            {path:'/orderlist',element:<OrderListPage/>},
            {path:'/editorderbysono/:soNo',element:<EditorderList/>},
            {path:'/orderprint/:soNo',element:<InvoicePage/>},
            {path:"/printorder",element:<PrintOrderpage/>},
            {path:"/ordervsinvoicereport",element:<InvoicevsOrderPage/>},
            {path:"/OutStandingReport",element:<OutStandingReport/>},
            {path:"/SalesVsPaymentPage",element:<SalesVsPaymentPage/>},
            {path:"/SalesVsPaymentRegister",element:<SalesvsPaymentRegister/>},
            {path:"/SalesReports",element:<ReportsPage/>}            
           ]
         }
    ]

    } 
 
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <ToastContainer />
   
     <RouterProvider router={router}   future={{ v7_startTransition: true }}/>
     </UserProvider>
  </StrictMode>,
)
