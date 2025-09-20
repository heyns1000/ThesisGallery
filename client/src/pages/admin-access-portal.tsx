import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

const accessTypes = [
  {
    id: "loyalty",
    name: "Loyalty Access",
    description: "Brand partners, rewards & alliance view",
    icon: "🪙",
    color: "blue"
  },
  {
    id: "shareholder",
    name: "Shareholder Access", 
    description: "Governance & ecosystem metrics dashboard",
    icon: "📊",
    color: "gray"
  },
  {
    id: "service",
    name: "Service Provider",
    description: "Integration & deployment tools",
    icon: "🤝",
    color: "green"
  },
  {
    id: "family",
    name: "Family Access",
    description: "Personal vaults, archive access & memory mesh",
    icon: "👨‍👩‍👧‍👦",
    color: "purple"
  }
];

const formTemplates = {
  loyalty: {
    title: "🪙 Loyalty Access Registration",
    fields: [
      { name: "fullName", placeholder: "Full Name", type: "text" },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "phone", placeholder: "Phone Number", type: "tel" },
      { name: "vaultName", placeholder: "Vault / Family Name", type: "text" },
      { name: "dob", placeholder: "Date of Birth", type: "date" },
      { name: "age", placeholder: "Age", type: "number" },
      { name: "referralCode", placeholder: "Referral Code (optional)", type: "text" },
      { name: "loyaltyMeaning", placeholder: "What does loyalty mean to you?", type: "textarea", colSpan: 2 }
    ],
    checkbox: "I understand this is a lifelong journey and relationship request."
  },
  service: {
    title: "🤝 Service Provider Onboarding",
    fields: [
      { name: "companyName", placeholder: "Company Name", type: "text" },
      { name: "regNumber", placeholder: "Registration / FICA Number", type: "text" },
      { name: "country", placeholder: "Country of Operation", type: "text" },
      { name: "officialEmail", placeholder: "Official Email Address", type: "email" },
      { name: "primaryContact", placeholder: "Primary Contact Number", type: "tel" },
      { name: "directorName", placeholder: "Company Director Full Name", type: "text" },
      { name: "serviceContact", placeholder: "24/7 Service Contact Name", type: "text" },
      { name: "documents", placeholder: "Upload Documents", type: "file" }
    ],
    checkbox: "I confirm this company offers 24/7 service and support."
  },
  family: {
    title: "👨‍👩‍👧‍👦 Family Access Registration",
    fields: [
      { name: "familyRep", placeholder: "Family Representative Name", type: "text" },
      { name: "familyName", placeholder: "Family Name", type: "text" },
      { name: "email", placeholder: "Email Address", type: "email" },
      { name: "dob", placeholder: "Date of Birth", type: "date" },
      { name: "age", placeholder: "Age", type: "number" },
      { name: "username", placeholder: "Desired Username", type: "text" },
      { name: "password", placeholder: "Create Password", type: "password" },
      { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
      { name: "vaultFile", placeholder: "Upload Vault File", type: "file" }
    ],
    checkbox: "Generate my vault at: faa.zone/public/FamilyName/username-password.html"
  },
  shareholder: {
    title: "📊 Welcome Shareholder",
    description: "Governance tools and ecosystem metrics will be enabled during onboarding.",
    fields: []
  }
};

export default function AdminAccessPortal() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📨 Submission", formData);
    setSubmitted(true);
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 hover:bg-blue-200 text-blue-800",
      gray: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      green: "bg-green-100 hover:bg-green-200 text-green-800",
      purple: "bg-purple-100 hover:bg-purple-200 text-purple-800"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-700">🌐 Seedwave™ Access Portal</h1>
        <p className="text-gray-600 mt-1">Corebrands management & AI logic deployment center™</p>
        <div className="mt-4">
          <Link href="/admin-portal">
            <Button variant="outline">
              ← Back to Admin Portal
            </Button>
          </Link>
        </div>
      </header>

      {!selectedForm && (
        /* Access Grid */
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {accessTypes.map((access) => (
            <button
              key={access.id}
              onClick={() => setSelectedForm(access.id)}
              className={`${getColorClasses(access.color)} p-6 rounded shadow text-center transition`}
            >
              <div className="text-3xl mb-2">{access.icon}</div>
              <div className="text-xl font-semibold">{access.name}</div>
              <p className="text-sm mt-1">{access.description}</p>
            </button>
          ))}
        </section>
      )}

      {selectedForm && !submitted && (
        /* Dynamic Form */
        <section className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
                {formTemplates[selectedForm as keyof typeof formTemplates].title}
              </CardTitle>
              {formTemplates[selectedForm as keyof typeof formTemplates].description && (
                <p className="text-gray-600">{formTemplates[selectedForm as keyof typeof formTemplates].description}</p>
              )}
            </CardHeader>
            <CardContent>
              {formTemplates[selectedForm as keyof typeof formTemplates].fields.length > 0 ? (
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formTemplates[selectedForm as keyof typeof formTemplates].fields.map((field: any, index: number) => (
                    <div key={index} className={field.colSpan === 2 ? "col-span-2" : ""}>
                      {field.type === "textarea" ? (
                        <textarea
                          placeholder={field.placeholder}
                          className="w-full border rounded p-2 h-24"
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      ) : (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full border rounded p-2"
                          onChange={(e) => handleInputChange(field.name, field.type === 'file' ? e.target.files?.[0] : e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                  
                  <label className="col-span-2 flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      onChange={(e) => handleInputChange('agreement', e.target.checked)}
                    />
                    {formTemplates[selectedForm as keyof typeof formTemplates].checkbox}
                  </label>

                  <div className="col-span-2 flex gap-4">
                    <Button 
                      type="submit" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2"
                    >
                      ✅ Submit Registration
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedForm(null)}
                    >
                      ← Back to Access Types
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">{formTemplates[selectedForm as keyof typeof formTemplates].description}</p>
                  <Button onClick={() => setSelectedForm(null)} variant="outline">
                    ← Back to Access Types
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {submitted && (
        /* Confirmation */
        <section className="max-w-3xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🦁</div>
              <h2 className="text-2xl font-bold text-orange-600 mb-4">Access Real SamFox Studio Gallery!</h2>
              <p className="text-gray-600 mb-6">
                Skip the placeholder forms and view your <strong>actual gallery with real data</strong> from your 1.8GB business ecosystem!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Link href="/gallery">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    📸 Visual Gallery
                  </Button>
                </Link>
                <Link href="/samfox-studio-platform">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                    🦁 SamFox Studio
                  </Button>
                </Link>
                <Link href="/documents">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    📜 Project Scrolls
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedForm(null);
                    setFormData({});
                  }}
                  variant="outline"
                >
                  Submit Another Request
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    🏡 Go to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-16">
        FAA.Zone Mesh • TreatyMesh Certified • All roles encrypted & routed via ⛓️ SecureScroll✂
      </footer>
    </div>
  );
}