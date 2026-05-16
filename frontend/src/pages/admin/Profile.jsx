import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, User, Mail, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would normally send the image to your backend
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-textMain">My Profile</h1>
        <p className="text-textMuted text-sm mt-1">Manage your personal information and profile picture</p>
      </div>

      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surfaceItem bg-surfaceItemHover flex items-center justify-center text-4xl font-bold text-textMain shadow-xl">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <Camera size={24} className="mb-1" />
                <span className="text-xs font-medium">Change</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            <p className="text-xs text-textMuted text-center max-w-[150px]">
              Allowed formats: JPEG, PNG. Max size: 2MB.
            </p>
          </div>

          {/* Profile Details Section */}
          <div className="flex-1 space-y-6 w-full">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-textMain mb-2 flex items-center gap-2">
                  <User size={16} className="text-primary" /> Username
                </label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  disabled 
                  className="input-field opacity-70 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-primary" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="input-field opacity-70 cursor-not-allowed" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> Role
                </label>
                <input 
                  type="text" 
                  value={user?.role || ''} 
                  disabled 
                  className="input-field opacity-70 cursor-not-allowed uppercase text-xs tracking-wider font-bold text-primary" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
