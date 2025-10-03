'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { UserCircle, Camera, Loader2, Check } from 'lucide-react'

type Profile = {
    username: string | null
    email: string | null
    avatar_url: string | null
}

export default function ProfileForm({session,profile} : {session: Session, profile: Profile | null}){
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [username, setUsername] = useState(profile?.username || '')
    const [avatarUrl, setAvatarUrl] =useState<string | null>(profile?.avatar_url || null)
    const [message, setMessage] = useState<{ text: String, type: 'success' | 'error' } | null>(null)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files){
            setSelectedFile(null)
            return
        }

        const file = e.target.files[0]
        setSelectedFile(file)

        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }

    const handleAvatarClick = () =>{
        fileInputRef.current?.click()
    }

    const uploadAvatar = async() => {
        if(!selectedFile  || !session?.user)
            return

        try{
            setUploading(true)
            setMessage(null)

            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${session.user.id}.${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase
                .storage
                .from('avatars')
                .upload(filePath, selectedFile, {upsert:true})

            if (uploadError)
                throw uploadError

            const { data: {publicUrl} } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)
            setMessage({ text: 'Avatar uploaded successfully!', type: 'success'})
        }
        catch (error: any){
            setMessage({ text: `Error uploading avatar: ${error.message}`, type: 'error'})
        }
        finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        if (selectedFile){
            uploadAvatar()
        }
    }, [selectedFile])

    async function updateProfile(){
        setLoading(true)
        setMessage(null)
        setSaveSuccess(false)

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: session.user.id,
                    username,
                    email: session.user.email,
                    avatar_url: avatarUrl
                })

            if (error) 
                throw error

            setSaveSuccess(true)

            setTimeout(() => {
                setSaveSuccess(false)
            },3000);
            
            router.refresh()
        }
        catch (error:any){
            setMessage({ text: error.message || 'Error updating the profile', type: 'error' })
        }
        finally {
            setLoading(false)
        }
    }

    async function handleSignOut(){
        await supabase.auth.signOut()
        router.push('/')
    }

    return(
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <h1 className="text-5xl text-center font-bold text-white mb-6">
                Your Profile
            </h1>
            <div className="space-y-6 bg-[#0f0f0f] p-8 rounded-lg border border-[#262626]">
                <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 cursor-pointer group" onClick={handleAvatarClick}>
                        {(previewUrl || avatarUrl) ? (
                            <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-gray-50">
                                <img
                                    src={previewUrl || avatarUrl || ''}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placeholderfornowgottaupdateitthroughmyghrawlink.com"
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-[#1a1a1a] flex items-center justify-center border-2 border-dashed border-gray-50">
                                <UserCircle className="h-20 w-20 text-gray-400"/>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-slate-900 bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className= "h-8 w-8 text-gray-50"/>
                        </div>

                        {uploading && (
                            <div className="absolute inset-0 bg-slate-900 bg-opacity-70 rounded-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-gray-50 animate-spin"/>
                            </div>
                        )}

                        {previewUrl && !uploading && (
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                <Check className="h-5 w-5 text-gray-50"/>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                        Click to upload a profile picture
                    </p>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        value={session.user.email}
                        disabled
                        className="mt-1 block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-gray-500"
                    />
                    
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-gray-50"
                    />
                </div>
                <div className="space-y-3">
                    <button
                        onClick={updateProfile}
                        className={`w-full ${saveSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-gray-50 rounded-md px-4 py-3 font-semibold transition-colors disabled:bg-indigo-400`}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (saveSuccess ? 'Saved Successfully!' :'Update Profile')}
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-red-500 text-gray-50 rounded-md px-4 py-3 font-semibold hover:bg-red-600"
                    >
                        Sign Out
                    </button>
                </div>
                {message && (
                    <div className={`text-center text-sm p-2 rounded ${
                        message.type === 'success' ? 'text-green-400' : 'text-red-500'
                    }`}>
                        {message.text}
                    </div>
                )}  
            </div>
        </div>
    )
}