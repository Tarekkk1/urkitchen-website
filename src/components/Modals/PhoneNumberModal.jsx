import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { toast } from "sonner";
import { Modal, ModalContent, Button } from "@heroui/react";
import { updateUserData } from "@/events/actions";

const PhoneCollectionModal = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updateUserData({
        phone: phoneNumber.slice(2), // Remove country code prefix
      });

      if (response?.data?.error) {
        toast.error(
          response.data.message || "Failed to update user information"
        );
      } else {
        toast.success("Information updated successfully");
        handleClose();
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      toast.error("Failed to update user information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" placement="center">
      <ModalContent>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please provide your phone number to continue with the order
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <PhoneInput
                country="in"
                value={phoneNumber}
                onChange={setPhoneNumber}
                enableSearch
                inputProps={{
                  className:
                    "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 focus:outline-none transition duration-300",
                }}
                containerClass="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="flat" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PhoneCollectionModal;
