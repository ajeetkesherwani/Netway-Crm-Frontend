import React from "react";
import { getResolvedTicket } from "../../../service/ticketReport";
import TicketsReportPage from "./TicketReportPage";

export default function ResolvedTicketReport() {
  return <TicketsReportPage fetcher={getResolvedTicket} title="Resolved Tickets" />;
}