import { RiHome9Line } from "react-icons/ri";
import {BsFileBarGraph} from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { IoIosGitBranch } from "react-icons/io";
import {CgFileDocument} from "react-icons/cg";
import { BsViewList } from "react-icons/bs";

const MenuLink = [
  {
    title: "Home",
    path: "/",
    icon: <RiHome9Line/>,
  },
  {
    title: "Sales",
    icon: <IoIosGitBranch/>,
    subMenu:[
      {
        title: "Create Sales Order",
        path: "/salesentry",
      },
      {
          title:"Print Sales Order",
          path:"/printorder"
      }
    ],
  },
  {
    title: "ListOrders",
    path: "/orderlist",
    icon: <BsViewList/>,
  },
  
  {
    title: "Report",
    icon: <CgFileDocument/>,
    subMenu: [     
      {
          title:"SO Vs Invoicereport ",
          path:"/ordervsinvoicereport"
      },
       
      {
          title:"Outstanding Report ",
          path:"/outstandingreport"
      },
      {
          title:"Sales Personwise Report ",
          path:"/SalesVsPaymentPage"
      },
      {
          title:"Sales Vs Payment Register ",
          path:"/SalesVsPaymentRegister"
      },

      { title:"Sales Report ", path:"/SalesReports" }
    ],
  },
]

export default MenuLink;
