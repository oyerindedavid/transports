import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import OperatorForm from '../components/admin/OperatorForm';
import Edituser from '../components/admin/Editoperator';

function Modifyoperator() {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [operatorToEdit, setOperatorToEdit] = useState(null); // New state to store operator for editing

  return (
    <div className='flex flex-col max-w-sm mx-auto py-4 my-3'>

      <div className='flex justify-between'>
        <div onClick={() => navigate(-1)}>
          {/* Return button */}
          <IoChevronBackCircleOutline size={35} />
        </div>

        <div onClick={() => setActive(!active)}>
          {!active ? (
            <button>
              {/* Add Operator button */}
              <IoIosPersonAdd size={35} /></button>
          ) : (
            <button onClick={() => setOperatorToEdit(null)} >
              {/* Cancel button */}
              <MdOutlineCancel size={35} />
            </button>
          )}
        </div>
      </div>

      {active && (
        <div className='py-4 my-3'>
          <OperatorForm setActive={setActive} operator={operatorToEdit} />
        </div>
      )}

      {/* Pass function to set the operator for editing */}
      {!active && <Edituser setOperatorToEdit={setOperatorToEdit} setActive={setActive} />}
    </div>
  );
}

export default Modifyoperator;
