import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Camera, KeyRound, User, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfile({ 
  name = "Admin User", 
  email = "admin@meesho.com", 
  role = "Administrator", 
  status = "Active",
  phone = "+91 XXXXXXXXXX",
  address = "Delhi, India",
  joinDate = "Oct 2026",
  avatarUrl = "" // Asli photo ke liye
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name, phone, address, avatarUrl });
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  const handleSaveProfile = () => { 
    setIsEditing(false); 
    toast.success("Profile Updated", {
      description: "Your personal details have been saved successfully."
    }); 
  };
  
  const handleChangePassword = () => { 
    toast.success("Password Changed", {
      description: "Your new password has been set securely."
    }); 
  };
  
  const handlePhotoUpload = (e) => { 
    if (e.target.files && e.target.files[0]) {
      toast.info("Photo Uploaded", {
        description: "Your new profile picture is ready."
      }); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Tabs defaultValue="general" className="w-full">
        {/* TABS MENU */}
        <TabsList className="mb-6 w-full max-w-sm grid grid-cols-2">
          <TabsTrigger value="general" className="flex gap-2 items-center"><User size={16}/> General</TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 items-center"><KeyRound size={16}/> Security</TabsTrigger>
        </TabsList>

        {/* 1. GENERAL TAB (Profile, Photo, Extra Details) */}
        <TabsContent value="general">
          <Card className="shadow-sm">
            <CardHeader className="relative">
              <CardTitle>Profile Information</CardTitle>
              
              {!isEditing && (
                <Button variant="outline" className="absolute top-6 right-6" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              
              {/* Photo Upload Section */}
              <div className="flex items-center gap-6 mb-8 border-b pb-6">
                <div className="relative group">
                  <Avatar className="h-28 w-28 bg-pink-100 text-[#b7004d]">
                    {formData.avatarUrl ? (
                      <AvatarImage src={formData.avatarUrl} alt={name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-5xl font-bold uppercase bg-pink-100">{name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white h-8 w-8" />
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 capitalize">{name}</h3>
                  <p className="text-gray-500 font-medium mt-1">{role} • Joined {joinDate}</p>
                </div>
              </div>

              {/* Information / Edit Form Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  {isEditing ? <Input value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} /> 
                             : <p className="font-medium text-gray-900">{formData.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  {isEditing ? <Input value={email} disabled /> 
                             : <p className="font-medium text-gray-900">{email}</p>}
                  {isEditing && <p className="text-xs text-gray-400">Email cannot be changed.</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  {isEditing ? <Input value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} /> 
                             : <p className="font-medium text-gray-900">{formData.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  {isEditing ? <Input value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} /> 
                             : <p className="font-medium text-gray-900">{formData.address}</p>}
                </div>

                {!isEditing && (
                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{status}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            {isEditing && (
              <CardFooter className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-2"/> Cancel</Button>
                <Button onClick={handleSaveProfile} className="bg-[#b7004d] hover:bg-[#b7004d]/90 text-white"><Save className="w-4 h-4 mr-2"/> Save Changes</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* 2. SECURITY TAB (Change Password) */}
        <TabsContent value="security">
          <Card className="shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" value={passData.current} onChange={(e)=>setPassData({...passData, current: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" value={passData.new} onChange={(e)=>setPassData({...passData, new: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" value={passData.confirm} onChange={(e)=>setPassData({...passData, confirm: e.target.value})} />
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button onClick={handleChangePassword} className="bg-black hover:bg-gray-800 text-white w-full md:w-auto">
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
