"use client"

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import styles from './sample.module.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const getData = async () => {
    const res = await fetch("http://localhost:3000/api/categories", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed");
    }

    return res.json();
};


const Editor = () => {

    const handleSubmit = async () => {
        const res = await fetch("/api/posts", {
          method: "POST",
          body: JSON.stringify({
            title,
            desc: value,
            img: media,
            slug: slugify(title),
            catSlug: catSlug || "style", //If not selected, choose the general category
          }),
        });
    
        if (res.status === 200) {
          const data = await res.json();
          router.push(`/posts/${data.slug}`);
        }
      };

    const slugify = (str) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const [content, setContent] = useState('');
    const { status } = useSession();
    const router = useRouter();
    console.log(useSession());
    if (status === "loading") {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/");
    }

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['code-block'],
            ['clean'],
        ],
    };

    const quillFormats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'image',
        'align',
        'color',
        'code-block',
    ];

    const handleEditorChange = (newContent) => {
        setContent(newContent);
    };

    return (
        <div className={styles.container}>
            <QuillEditor
                value={content}
                onChange={handleEditorChange}
                modules={quillModules}
                formats={quillFormats}
                className="w-full h-[70%] mt-10 bg-white"
            />
        </div>
    );
};

export default Editor;