import React, { useState, useRef } from 'react';
import { useWebApp } from '../../context/WebAppContext';
import { KalaPost } from '../../../models/kalachannel';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  Plus, 
  X,
  Radio,
  Tv,
  Upload,
  Camera,
  Video
} from 'lucide-react';

export const KalaChannelView: React.FC = () => {
  const { 
    posts, 
    toggleLikePost, 
    addPostComment, 
    createPost, 
    products, 
    setSelectedProduct, 
    addToCart, 
    currentUser, 
    currentRole, 
    t 
  } = useWebApp();

  const [activePostIdx, setActivePostIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [commentOpenPostId, setCommentOpenPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New post form state
  const [newCaption, setNewCaption] = useState('');
  const [newCraftType, setNewCraftType] = useState('Handloom Weaving');
  const [newStoryType, setNewStoryType] = useState<'workshop_live' | 'craft_story' | 'behind_scenes'>('workshop_live');
  const [newMediaUri, setNewMediaUri] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [mediaFileName, setMediaFileName] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reelFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleReelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) {
        setNewMediaUri(dataUri);
      }
    };
    reader.readAsDataURL(file);
  };

  const activePost = posts[activePostIdx] || posts[0];

  const handleNextPost = () => {
    setActivePostIdx((prev) => (prev + 1) % posts.length);
  };

  const handlePrevPost = () => {
    setActivePostIdx((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentOpenPostId || !commentInput.trim()) return;
    addPostComment(commentOpenPostId, commentInput);
    setCommentInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const myProducts = products.filter(p => p.artisanId === currentUser?.id);
    const linkedProd = myProducts[0] || null;

    createPost({
      artisanId: currentUser?.id || 'artisan',
      artisanName: currentUser?.fullName || 'Master Artisan',
      artisanLocation: 'Patan & Heritage Clusters, Gujarat',
      artisanAvatarEmoji: '🥻',
      craftType: newCraftType,
      mediaType: newMediaUri.includes('.mp4') || newMediaUri.startsWith('data:video') ? 'video' : 'image',
      mediaUri: newMediaUri,
      videoThumbnailUri: 'https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80',
      storyType: newStoryType,
      caption: newCaption,
      linkedProductId: linkedProd?.id,
      linkedProductTitle: linkedProd?.info.titleEn,
      linkedProductPrice: linkedProd?.pricing?.finalListingPrice,
    });

    setIsCreateModalOpen(false);
    setNewCaption('');
    setMediaFileName('');
  };

  // Find linked product if available
  const linkedProduct = activePost?.linkedProductId 
    ? products.find(p => p.id === activePost.linkedProductId) 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-[#D97706]">
              <Tv className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-gray-900">
              KalaChannel — {t('Craft Storytelling & Workshop Reels', 'शिल्प गाथाएं व कार्यशाला रील्स')}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('Watch live looms, bell-metal casting, and low-fire kilns. Every reel connects directly to the artisan’s store.', 'पारंपरिक करघे और भट्ठियों के जीवंत वीडियो। सीधे कारीगर के उत्पाद से जुड़ाव।')}
          </p>
        </div>

        {currentRole === 'artisan' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D97706] text-white font-bold text-xs shadow-md shadow-rose-200 hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('+ Post Craft Reel / Story', '+ नया वीडियो या कहानी जोड़ें')}</span>
          </button>
        )}
      </div>

      {/* Main Reels Theater Player */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md h-[680px] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Media Player */}
          {activePost?.mediaType === 'video' ? (
            <div className="absolute inset-0" onClick={handleTogglePlay}>
              <video
                ref={videoRef}
                src={activePost.mediaUri}
                poster={activePost.videoThumbnailUri}
                muted={isMuted}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white/80" />
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0">
              <img
                src={activePost?.mediaUri}
                alt="Story"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Top Overlays */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/20 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                <span>{activePost?.storyType === 'workshop_live' ? 'Live Workshop' : 'Craft Story'}</span>
              </span>
              <span className="text-[11px] font-semibold text-white/90 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                {activePost?.craftType}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activePost?.mediaType === 'video' && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Right Floating Engagement Buttons */}
          <div className="relative z-10 p-4 self-end flex flex-col items-center gap-4 text-white">
            {/* Heart Like */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => toggleLikePost(activePost.id)}
                className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-transform active:scale-125 cursor-pointer ${
                  activePost.isLikedByMe ? 'bg-rose-600 text-white' : 'bg-black/50 hover:bg-black/70 text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${activePost.isLikedByMe ? 'fill-white' : ''}`} />
              </button>
              <span className="text-[11px] font-bold mt-1 drop-shadow-md">{activePost.likesCount}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setCommentOpenPostId(activePost.id)}
                className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <span className="text-[11px] font-bold mt-1 drop-shadow-md">{activePost.commentsCount}</span>
            </div>

            {/* Share */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: activePost.caption, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Reel link copied!');
                }
              }}
              className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Story Info & Direct Commerce Link */}
          <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent text-white space-y-3">
            {/* Artisan Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-500/80 flex items-center justify-center text-lg shadow-sm border border-white/30">
                {activePost.artisanAvatarEmoji || '🧵'}
              </div>
              <div>
                <p className="font-extrabold text-sm text-white drop-shadow-sm">{activePost.artisanName}</p>
                <p className="text-[10px] text-gray-300 drop-shadow-sm">{activePost.artisanLocation}</p>
              </div>
            </div>

            {/* Caption */}
            <p className="text-xs text-white/90 leading-relaxed line-clamp-3 drop-shadow-sm">
              {activePost.caption}
            </p>

            {/* Direct Commerce Link Card */}
            {activePost.linkedProductTitle && (
              <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3 shadow-lg">
                <div className="truncate">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300 block">{t('Featured in this Video', 'वीडियो में प्रदर्शित शिल्प')}</span>
                  <p className="font-bold text-xs text-white truncate">{activePost.linkedProductTitle}</p>
                  <p className="text-xs font-black text-amber-300">₹{activePost.linkedProductPrice || 2450}</p>
                </div>

                <button
                  onClick={() => {
                    if (linkedProduct) {
                      addToCart(linkedProduct, 1);
                    } else if (products[0]) {
                      addToCart(products[0], 1);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] shrink-0 shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('Shop Now', 'खरीदें')}</span>
                </button>
              </div>
            )}

            {/* Next / Previous Reel Navigation Buttons */}
            <div className="flex items-center justify-between pt-1 text-xs text-white/70">
              <button
                onClick={handlePrevPost}
                className="hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                ← {t('Previous Reel', 'पिछला')}
              </button>
              <span className="text-[11px] font-mono">
                {activePostIdx + 1} / {posts.length}
              </span>
              <button
                onClick={handleNextPost}
                className="hover:text-white px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                {t('Next Reel', 'अगला')} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Comments Drawer / Modal */}
      {commentOpenPostId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">{t('Patron Comments & Appreciation', 'प्रशंसा व टिप्पणियां')}</h3>
              <button onClick={() => setCommentOpenPostId(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-bold text-gray-900">Ananya Sharma (Interior Designer):</span>
                <p className="text-gray-600">The intricate extra-weft geometry is simply stunning! Can we order 25 of these shawls in natural beige?</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-bold text-gray-900">Vikramaditya Singh:</span>
                <p className="text-gray-600">Pure dedication to preserving authentic pit-loom handloom traditions. Remarkable craftsmanship!</p>
              </div>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-gray-100">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t('Write an encouraging word for the artisan...', 'कारीगर के लिए प्रशंसा लिखें...')}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#E11D48]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#E11D48] text-white hover:bg-[#BE123C] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE REEL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {t('Post Craft Reel to KalaChannel', 'कलाचैनल पर रील जोड़ें')}
                </h3>
                <p className="text-xs text-gray-500">
                  {t('Share your pit loom, wheel spinning, or furnace casting with buyers.', 'अपने करघे या कार्यशाला की कला का वीडियो साझा करें।')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Story Theme', 'थीम')}</label>
                <select
                  value={newStoryType}
                  onChange={(e) => setNewStoryType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white"
                >
                  <option value="workshop_live">Workshop Live</option>
                  <option value="craft_story">Heritage Craft Story</option>
                  <option value="behind_scenes">Behind the Scenes</option>
                </select>
              </div>

              {/* Direct Media File Upload - No URL required */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Upload Workshop Video or Craft Photo', 'कार्यशाला वीडियो या शिल्प फोटो अपलोड करें')}
                </label>
                <input
                  type="file"
                  ref={reelFileInputRef}
                  onChange={handleReelFileUpload}
                  accept="video/*,image/*"
                  className="hidden"
                />

                <div 
                  onClick={() => reelFileInputRef.current?.click()}
                  className="p-4 border-2 border-dashed border-rose-200 hover:border-[#E11D48] bg-rose-50/30 hover:bg-rose-50/60 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs text-[#E11D48] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {mediaFileName ? `✓ ${mediaFileName}` : t('Choose Video / Photo from Device or Camera', 'डिवाइस या कैमरे से वीडियो/फोटो चुनें')}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {t('No URL needed! Directly upload MP4, MOV, WebM, or JPG', 'किसी यूआरएल की आवश्यकता नहीं है')}
                    </p>
                  </div>
                </div>

                {/* Quick 1-Tap Authentic Craft Presets */}
                <div className="mt-2.5 space-y-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                    {t('Or Test with 1-Tap Authentic Artisan Video:', 'या प्रामाणिक वीडियो से परीक्षण करें:')}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewMediaUri('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                        setMediaFileName('Pit-Loom-Double-Ikat.mp4');
                        setNewCaption('The rhythmic beat of the shuttle on our 900-year-old traditional pit loom in Patan. Pure mulberry silk dyed in natural botanical extracts.');
                      }}
                      className="p-2 rounded-xl border border-gray-200 hover:border-[#E11D48] bg-white text-left text-[11px] font-medium text-gray-700 hover:text-[#E11D48] transition-colors cursor-pointer"
                    >
                      🧵 {t('Loom Weaving Video', 'करघा बुनाई वीडियो')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewMediaUri('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4');
                        setMediaFileName('Blue-Pottery-Wheel.mp4');
                        setNewCaption('Hand-turning quartz faience on the potter wheel in Kot Jewar, Jaipur. Hand-painted Persian floral motifs with cobalt oxide.');
                      }}
                      className="p-2 rounded-xl border border-gray-200 hover:border-[#E11D48] bg-white text-left text-[11px] font-medium text-gray-700 hover:text-[#E11D48] transition-colors cursor-pointer"
                    >
                      🏺 {t('Pottery Wheel Video', 'कुम्हार का चाक वीडियो')}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('Caption & Craft Technique', 'विवरण व शिल्प तकनीक')}</label>
                <textarea
                  rows={3}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Describe the sound of the loom, materials, natural dyes..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  {t('Cancel', 'रद्द करें')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] cursor-pointer"
                >
                  {t('Publish Reel', 'रील प्रकाशित करें')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
