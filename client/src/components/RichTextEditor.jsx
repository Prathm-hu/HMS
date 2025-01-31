import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
// this is amazing library we can made using this library super editor and functionality
const RichTextEditor = ({ input, setInput }) => {
    const handleChange = (content) => {
        setInput({ ...input, description: content });
    }
    return (
        <ReactQuill theme='snow' value={input.description} onChange={(e) => handleChange(e)}></ReactQuill>
    )
}

export default RichTextEditor