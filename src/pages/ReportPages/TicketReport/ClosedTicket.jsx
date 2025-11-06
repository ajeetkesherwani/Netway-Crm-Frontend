import React from "react";
import { getCloseTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function ClosedTicketReport() {
  return <TicketsReportPage fetcher={getCloseTicket} title="Closed Tickets" />;
}