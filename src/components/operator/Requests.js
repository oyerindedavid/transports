import React, { useState, useRef } from 'react';
import Viewdetails from './Viewdetails';
import { GrGroup } from "react-icons/gr";
import { GiPathDistance } from "react-icons/gi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { deleteRequest } from '../../hooks/https';

export default function Requests({ data }) {
    const [show, setShow] = useState(false); // Toggle details
    const [isDeleting, setIsDeleting] = useState(false); // Trigger animation
    const [isRemoved, setIsRemoved] = useState(false); // Remove element from DOM
    const [open, setOpen] = useState(false); // Modal visibility

    const handleDelete = async () => {
        setShow(false);
        setIsDeleting(true); // Trigger animation
        setTimeout(() => {
            setIsRemoved(true); // Completely remove element after animation
            deleteRequest(data._id); // Perform delete request
        }, 300); // Duration matches the animation time
    };

    const toggle = () => {
        setShow((prev) => !prev); // Toggle details view
    };

    if (isRemoved) return null; // Completely remove from DOM when marked as removed

    return (
        <div
            className={`flex flex-col border border-black-200 mb-1 pb-2 rounded-lg ${isDeleting ? "opacity-0 transition-opacity duration-300 ease-out" : ""
                }`}
            style={{
                transition: "opacity 0.3s ease-out", // Smooth transition
            }}
        >
            <div onClick={toggle}>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                        <div>{data.fullName}</div>
                        <div>
                            <GrGroup size={27} className="inline" /> {data.numOfPersons}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs max-w-sm">
                        <div>
                            {data.address}
                            <br />
                            <button className="align-middle" onClick={() => { setOpen(true) }}>
                                <IoTrashOutline className="inline-block" color="red" size={25} />
                            </button>
                            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                                <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <ExclamationTriangleIcon
                                                            aria-hidden="true"
                                                            className="h-6 w-6 text-red-600"
                                                        />
                                                    </div>
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                            Delete Request
                                                        </DialogTitle>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Are you sure you want to delete the request of <b>{data.fullName}</b>?
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    onClick={handleDelete}
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setShow(false); setOpen(false) }}
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </div>
                            </Dialog>
                        </div>
                        <div>
                            <GiPathDistance size={20} className="inline" /> {data.distanceData?.distance.text}
                            <br />
                            <MdOutlineAccessTimeFilled size={20} className="inline" /> {data.distanceData?.duration.text}
                        </div>
                    </div>
                </div>
            </div>
            <span
                style={{
                    maxHeight: show && !open ? "300px" : "0px", // Adjust height dynamically
                    transition: "max-height 0.5s ease", // Smooth transition
                    overflow: "hidden",
                }}
                className="bg-gray-100 mt-2"
            >
                <Viewdetails request={data} />
            </span>
        </div>
    );
}
