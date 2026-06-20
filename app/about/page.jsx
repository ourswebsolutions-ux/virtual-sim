'use client'
import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, ChevronDown, LogOut, ExternalLink, Check, Clock, AlertCircle, Download } from 'lucide-react';
import About from '../components/About';
import FAQ from '../components/FAQ';


export default function Dashboard() {

    return (
        <>
            <About />
            <FAQ />
        </>
    );
}