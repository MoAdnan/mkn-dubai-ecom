"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Building,
  Home,
  Loader2,
  X,
  Save,
} from "lucide-react";
import {
  getUserAddressesAction,
  saveUserAddressAction,
  deleteUserAddressAction,
  type UserAddress,
} from "@/app/actions/addresses";

const UAE_EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Fujairah",
];

export default function SavedAddressesPage() {
  const [addresses, setAddresses] = React.useState<UserAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form Fields
  const [recipientName, setRecipientName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [emirate, setEmirate] = React.useState("Dubai");
  const [area, setArea] = React.useState("");
  const [streetAddress, setStreetAddress] = React.useState("");
  const [buildingName, setBuildingName] = React.useState("");
  const [apartmentNumber, setApartmentNumber] = React.useState("");
  const [isDefault, setIsDefault] = React.useState(false);

  const fetchAddresses = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserAddressesAction();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const openAddModal = () => {
    setEditingId(null);
    setRecipientName("");
    setPhone("+971 50 ");
    setEmirate("Dubai");
    setArea("");
    setStreetAddress("");
    setBuildingName("");
    setApartmentNumber("");
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: UserAddress) => {
    setEditingId(addr.id);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setEmirate(addr.emirate);
    setArea(addr.area);
    setStreetAddress(addr.streetAddress);
    setBuildingName(addr.buildingName || "");
    setApartmentNumber(addr.apartmentNumber || "");
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveUserAddressAction({
        id: editingId || undefined,
        recipientName,
        phone,
        emirate,
        area,
        streetAddress,
        buildingName,
        apartmentNumber,
        isDefault,
      });
      setIsModalOpen(false);
      await fetchAddresses();
    } catch (err) {
      alert("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery address?")) return;
    try {
      await deleteUserAddressAction(id);
      await fetchAddresses();
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/account"
            className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account Overview</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Saved UAE Delivery Addresses ({addresses.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Fast 1-click delivery locations across all 7 United Arab Emirates
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading saved addresses from database...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-lg font-bold">No saved addresses found</h2>
          <p className="text-xs text-muted-foreground">
            Add your primary Dubai or UAE residence to enable express 1-click checkout.
          </p>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border p-5 space-y-3 relative bg-card transition-all ${
                addr.isDefault
                  ? "border-cyan-500/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "border-border/70 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Home className="w-4 h-4 text-cyan-400" />
                  <span>{addr.recipientName}</span>
                </span>
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Default Delivery</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1 pt-1">
                <p className="flex items-center gap-1.5 text-foreground font-medium">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{addr.phone}</span>
                </p>
                <p className="flex items-start gap-1.5 pt-1">
                  <Building className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>
                    {addr.buildingName && `${addr.buildingName}, `}
                    {addr.apartmentNumber && `${addr.apartmentNumber}, `}
                    {addr.streetAddress}
                  </span>
                </p>
                <p className="font-semibold text-foreground pl-5">
                  {addr.area}, {addr.emirate}, UAE
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                <div>
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        saveUserAddressAction({ ...addr, isDefault: true }).then(fetchAddresses)
                      }
                      className="text-[11px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 rounded-lg border border-border/70 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="font-heading font-black text-lg text-foreground">
                {editingId ? "Edit Delivery Address" : "Add New UAE Address"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adnan Al-Hashimi"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    UAE Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Emirate *
                  </label>
                  <select
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {UAE_EMIRATES.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    District / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downtown, Dubai Marina"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sheikh Mohammed bin Rashid Blvd"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Building / Tower Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Burj Crown Tower"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Apartment / Suite / Villa #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apt 1402"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-cyan-500"
                  />
                  <span>Make this my default UAE delivery address</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border/80 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Address to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
