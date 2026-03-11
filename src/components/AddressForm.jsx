import React, { useState } from "react";
import { X, Home, Briefcase, MapPin } from "lucide-react";

const AddressForm = ({ initialAddress = {}, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type: "Home",
        building_no: "",
        building_name: "",
        street_no: "",
        area_name: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false,
        ...initialAddress
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="address-form-modal">
            <div className="address-form-container">
                <div className="address-form-header">
                    <h3>{initialAddress.id ? "Edit Address" : "Add New Address"}</h3>
                    <button className="close-btn" onClick={onCancel}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="address-form">
                    <div className="address-type-selector">
                        <label className={`type-btn ${formData.type === 'Home' ? 'active' : ''}`}>
                            <input type="radio" name="type" value="Home" checked={formData.type === 'Home'} onChange={handleChange} />
                            <Home size={18} /> Home
                        </label>
                        <label className={`type-btn ${formData.type === 'Office' ? 'active' : ''}`}>
                            <input type="radio" name="type" value="Office" checked={formData.type === 'Office'} onChange={handleChange} />
                            <Briefcase size={18} /> Office
                        </label>
                        <label className={`type-btn ${formData.type === 'Other' ? 'active' : ''}`}>
                            <input type="radio" name="type" value="Other" checked={formData.type === 'Other'} onChange={handleChange} />
                            <MapPin size={18} /> Other
                        </label>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Building No.</label>
                            <input name="building_no" value={formData.building_no} onChange={handleChange} placeholder="e.g. 101, A-Wing" required />
                        </div>
                        <div className="input-group">
                            <label>Building Name</label>
                            <input name="building_name" value={formData.building_name} onChange={handleChange} placeholder="e.g. Green Heights" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Street No. / Name</label>
                            <input name="street_no" value={formData.street_no} onChange={handleChange} placeholder="e.g. MG Road" required />
                        </div>
                        <div className="input-group">
                            <label>Area / Locality</label>
                            <input name="area_name" value={formData.area_name} onChange={handleChange} placeholder="e.g. Bandra West" required />
                        </div>
                    </div>

                    <div className="form-row thirds">
                        <div className="input-group">
                            <label>City</label>
                            <input name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" required />
                        </div>
                        <div className="input-group">
                            <label>State</label>
                            <input name="state" value={formData.state} onChange={handleChange} placeholder="Maharashtra" required />
                        </div>
                        <div className="input-group">
                            <label>Pincode</label>
                            <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="400001" required />
                        </div>
                    </div>

                    <label className="default-checkbox">
                        <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} />
                        Set as default address
                    </label>

                    <button type="submit" className="save-address-btn">
                        SAVE ADDRESS
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
