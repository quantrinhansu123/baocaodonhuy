import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function XemBaoCaoMKT() {
  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        zIndex: 1000,
        background: 'white',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Link 
          to="/trang-chu" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            color: '#2d7c2d',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px'
          }}
        >
          <ChevronLeft style={{ width: '20px', height: '20px', marginRight: '4px' }} />
          <span>Quay lại</span>
        </Link>
      </div>
      
      <iframe 
        src="/viewNsMoiNhanh.html"
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          display: 'block'
        }}
        title="Xem Báo Cáo MKT"
      />
    </div>
  );
}
