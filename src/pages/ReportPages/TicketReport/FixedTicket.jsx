import React from "react";
import { getFixedTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function FixedTicketReport() {
  return <TicketsReportPage fetcher={getFixedTicket} title="Fixed Tickets" />;
}