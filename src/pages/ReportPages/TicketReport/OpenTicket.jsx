import React from "react";
import { getOpenTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function OpenTicketReport() {
  return <TicketsReportPage fetcher={getOpenTicket} title="Open Tickets" />;
}