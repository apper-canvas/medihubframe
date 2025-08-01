import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import TabNavigation from "@/components/molecules/TabNavigation";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { patientsService } from "@/services/api/patientsService";
import { medicalRecordsService } from "@/services/api/medicalRecordsService";
import { format } from "date-fns";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "medical-history", label: "Medical History" },
    { id: "current-treatment", label: "Current Treatment" },
    { id: "medications", label: "Medications" },
    { id: "lab-results", label: "Lab Results" },
    { id: "notes", label: "Notes" }
  ];

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientData, medicalData] = await Promise.all([
        patientsService.getById(id),
        medicalRecordsService.getByPatientId(id)
      ]);
      
      setPatient(patientData);
      setMedicalRecord(medicalData);
      setEditData(patientData);
    } catch (err) {
      setError(err.message || "Failed to load patient data");
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await patientsService.update(id, editData);
      setPatient(editData);
      setEditMode(false);
      toast.success("Patient information updated successfully");
    } catch (err) {
      toast.error("Failed to update patient information");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadPatientData} />;
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patient Information */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
            <div className="flex space-x-2">
              {editMode ? (
                <>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      setEditMode(false);
                      setEditData(patient);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              name="name"
              value={editMode ? editData.name : patient.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={!editMode}
            />
            <FormField
              label="Age"
              name="age"
              type="number"
              value={editMode ? editData.age : patient.age}
              onChange={(e) => handleInputChange("age", parseInt(e.target.value))}
              disabled={!editMode}
            />
            <FormField
              label="Gender"
              name="gender"
              value={editMode ? editData.gender : patient.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              disabled={!editMode}
            />
            <FormField
              label="Phone"
              name="phone"
              value={editMode ? editData.phone : patient.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={!editMode}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={editMode ? editData.email : patient.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!editMode}
            />
            <FormField
              label="Blood Type"
              name="bloodType"
              value={editMode ? editData.bloodType : patient.bloodType}
              onChange={(e) => handleInputChange("bloodType", e.target.value)}
              disabled={!editMode}
            />
          </div>
          
          <div className="mt-4">
            <FormField
              label="Address"
              name="address"
              value={editMode ? editData.address : patient.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!editMode}
            />
          </div>
        </Card>
      </div>

      {/* Quick Info */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Patient Status</span>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medical Status</span>
              <StatusBadge status={patient.medicalStatus} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Room</span>
              <span className="font-medium">{patient.room || "Not assigned"}</span>
            </div>
          </div>
        </Card>

        {/* Admission Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Details</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Admission Date</span>
              <p className="font-medium">{format(new Date(patient.admissionDate), "PPP")}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Assigned Doctor</span>
              <p className="font-medium">{patient.assignedDoctor}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Insurance</span>
              <p className="font-medium">{patient.insurance}</p>
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="space-y-2">
            <p className="font-medium">{patient.emergencyContact.name}</p>
            <p className="text-sm text-gray-600">{patient.emergencyContact.relationship}</p>
            <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical History</h3>
      {medicalRecord?.history?.length > 0 ? (
        <div className="space-y-4">
          {medicalRecord.history.map((entry, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900">{entry.condition}</h4>
                <span className="text-sm text-gray-500">
                  {format(new Date(entry.date), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{entry.treatment}</p>
              <p className="text-xs text-gray-500">Treated by: {entry.doctor}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No medical history available</p>
      )}
    </Card>
  );

  const renderCurrentTreatment = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Treatment</h3>
      {medicalRecord?.currentTreatment ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <p className="text-gray-900">{medicalRecord.currentTreatment.condition}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
            <p className="text-gray-900">{medicalRecord.currentTreatment.plan}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <p className="text-gray-900">
                {format(new Date(medicalRecord.currentTreatment.startDate), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration</label>
              <p className="text-gray-900">{medicalRecord.currentTreatment.expectedDuration}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No current treatment information</p>
      )}
    </Card>
  );

  const renderMedications = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Medications</h3>
      {medicalRecord?.medications?.length > 0 ? (
        <div className="space-y-4">
          {medicalRecord.medications.map((med, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{med.name}</h4>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {med.dosage}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Frequency: {med.frequency}</p>
              <p className="text-xs text-gray-500">
                Prescribed by: {med.prescribedBy} • Started: {format(new Date(med.startDate), "MMM d, yyyy")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No medications prescribed</p>
      )}
    </Card>
  );

  const renderLabResults = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Lab Results</h3>
      {medicalRecord?.labResults?.length > 0 ? (
        <div className="space-y-4">
          {medicalRecord.labResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{result.test}</h4>
                <span className="text-sm text-gray-500">
                  {format(new Date(result.date), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{result.results}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                result.status === "Normal" ? "bg-success/10 text-success" :
                result.status === "Abnormal" ? "bg-error/10 text-error" :
                "bg-warning/10 text-warning"
              }`}>
                {result.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No lab results available</p>
      )}
    </Card>
  );

  const renderNotes = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Clinical Notes</h3>
      {medicalRecord?.notes?.length > 0 ? (
        <div className="space-y-4">
          {medicalRecord.notes.map((note, index) => (
            <div key={index} className="border-l-4 border-accent pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{note.author}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(note.date), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-gray-700">{note.note}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No clinical notes available</p>
      )}
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "medical-history":
        return renderMedicalHistory();
      case "current-treatment":
        return renderCurrentTreatment();
      case "medications":
        return renderMedications();
      case "lab-results":
        return renderLabResults();
      case "notes":
        return renderNotes();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/patients")}
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Patient ID: #{patient.Id.toString().padStart(4, "0")}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={patient.status} />
          <StatusBadge status={patient.medicalStatus} />
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default PatientDetail;