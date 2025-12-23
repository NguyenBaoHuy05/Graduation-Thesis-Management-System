"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { mockForms, FormTemplate } from "@/data/mockData";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
interface GetFormTemplateData {
  formTemplates: FormTemplate[];
}
const GET_FORM_TEMPLATES = gql`
  query GetFormTemplates {
    formTemplates {
      id
      name
      description
      fileUrl
      type
    }
  }
`;
export default function PublicFormsPage() {
  const { loading, error, data } =
    useQuery<GetFormTemplateData>(GET_FORM_TEMPLATES);

  const forms = data?.formTemplates || [];
  console.log(data, error);
  // if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  // if (error)
  //   return (
  //     <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu.</div>
  //   );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header based on image */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-900">
              Biểu mẫu Luận văn / Đồ án Tốt nghiệp – Tải xuống
            </h1>
          </div>

          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center font-bold text-gray-900 w-16 uppercase text-sm border-b border-gray-200">
                    TT
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900 uppercase text-sm border-b border-gray-200">
                    Biểu mẫu
                  </th>
                  <th className="px-6 py-4 text-right font-bold text-gray-900 uppercase text-sm border-b border-gray-200">
                    Tải xuống
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {forms.map((form, index) => (
                  <tr
                    key={form.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {form.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={form.fileUrl}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition uppercase tracking-wider"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tải xuống
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2024 Khoa Công nghệ Thông tin - Trường ĐH Sư phạm TP.HCM
          </div>
        </div>
      </main>
    </div>
  );
}
