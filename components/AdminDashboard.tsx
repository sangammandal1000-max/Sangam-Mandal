import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ContentItem, Category, Message } from '../types';
import { AddIcon } from './icons/AddIcon';
import { Header } from './Header';
import { AdminContentCard } from './AdminContentCard';
import { PaletteIcon } from './icons/PaletteIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { ContentFormModal } from './ContentFormModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { SettingsIcon } from './icons/SettingsIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { SaveIcon } from './icons/SaveIcon';
import { useDesign } from '../../contexts/DesignContext';
import { ContentIcon } from './icons/ContentIcon';
import { EyeIcon } from './icons/EyeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import { SearchIcon } from './icons/SearchIcon';
import { TrashIcon } from './icons/TrashIcon';
import { Pagination } from './Pagination';
import { BulkDeleteConfirmationModal } from './BulkDeleteConfirmationModal';
import { ImageIcon } from './icons/ImageIcon';
import { UploadIcon } from './icons/UploadIcon';
import { StarIcon } from './icons/StarIcon';
import { StarOffIcon } from './icons/StarOffIcon';
import { TagIcon } from './icons/TagIcon';
import { ShareIcon } from './icons/ShareIcon';
import { db, storage } from '../../firebase/firebaseConfig';
import { CategoryIcon } from './icons/CategoryIcon';
import { CategoryFormModal } from './CategoryFormModal';
import { AdminCategoryCard } from './AdminCategoryCard';
import { MessageIcon } from './icons/MessageIcon';
import { MailIcon } from './icons/MailIcon';


interface AdminDashboardProps {
    onLogout: () => void;
    initialContent: ContentItem[];
    initialCategories: Category[];
}

const TABS = ['Content', 'Categories', 'Messages', 'Design', 'Stats'];
const ITEMS_PER_PAGE = 8;

const StatCard: React.FC<{
    icon: React.ReactElement<{ className?: string }>;
    title: string;
    value: string | number;
    colorClass: { bg: string; text: string };
}> = ({ icon, title, value, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass.bg}`}>
            {React.cloneElement(icon, { className: `w-7 h-7 ${colorClass.text}` })}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const CategoryProgressBar: React.FC<{
    name: string;
    value: number;
    percentage: number;
    color: string;
}> = ({ name, value, percentage, color }) => (
    <div>
        <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
    </div>
);

const LineChart: React.FC<{ data: number[]; labels: string[]; lineColor: string; gradientColor: string; onHover: (index: number | null) => void; hoveredIndex: number | null; yAxisLabel: string; }> = ({ data, labels, lineColor, gradientColor, onHover, hoveredIndex, yAxisLabel }) => {
    const chartRef = useRef<SVGSVGElement>(null);
    const [chartWidth, setChartWidth] = useState(600);
    const svgHeight = 320, yTopPadding = 60, yBottomPadding = 30, xPadding = 40, chartDrawableHeight = svgHeight - yTopPadding - yBottomPadding;
    const line = (pointA: {x: number, y: number}, pointB: {x: number, y: number}) => ({ length: Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)), angle: Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) });
    const controlPoint = (current: {x: number, y: number}, previous: {x: number, y: number} | undefined, next: {x: number, y: number} | undefined, reverse?: boolean) => { const p = previous || current, n = next || current, smoothing = 0.2, o = line(p, n), angle = o.angle + (reverse ? Math.PI : 0), length = o.length * smoothing; return [current.x + Math.cos(angle) * length, current.y + Math.sin(angle) * length]; };
    const createSmoothPath = (points: {x: number, y: number}[]) => points.map((point, i) => { if (i === 0) return `M ${point.x},${point.y}`; const [cpsX, cpsY] = controlPoint(points[i - 1], points[i - 2], point); const [cpeX, cpeY] = controlPoint(point, points[i - 1], points[i + 1], true); return `C ${cpsX.toFixed(2)},${cpsY.toFixed(2)} ${cpeX.toFixed(2)},${cpeY.toFixed(2)} ${point.x.toFixed(2)},${point.y.toFixed(2)}`; }).join(' ');
    useEffect(() => { const ro = new ResizeObserver(e => e[0] && setChartWidth(e[0].contentRect.width)); if(chartRef.current) ro.observe(chartRef.current); return () => ro.disconnect(); }, []);
    const yAxisValues = useMemo(() => { const max = Math.max(...data, 1); const range = Math.ceil(max / 4) * 4; const step = range / 4; return Array.from({ length: 5 }, (_, i) => Math.round(i * step)); }, [data]);
    const yAxisMax = yAxisValues[yAxisValues.length - 1] || 1;
    const dataPoints = useMemo(() => data.map((d, i) => ({ x: xPadding + (i * (chartWidth - 2 * xPadding)) / (data.length - 1), y: yTopPadding + chartDrawableHeight - (d / yAxisMax) * chartDrawableHeight, value: d })), [data, chartWidth, yAxisMax]);
    const linePath = useMemo(() => dataPoints.length > 1 ? createSmoothPath(dataPoints) : `M ${dataPoints[0]?.x || 0} ${dataPoints[0]?.y || 0}`, [dataPoints]);
    const areaPath = useMemo(() => linePath + ` L ${dataPoints[dataPoints.length - 1]?.x || 0} ${svgHeight - yBottomPadding} L ${dataPoints[0]?.x || 0} ${svgHeight - yBottomPadding} Z`, [linePath, dataPoints]);
    const pathRef = useRef<SVGPathElement>(null);
    useEffect(() => { if (pathRef.current) { const len = pathRef.current.getTotalLength(); pathRef.current.style.strokeDasharray = `${len}`; pathRef.current.style.strokeDashoffset = `${len}`; setTimeout(() => { if(pathRef.current) { pathRef.current.style.transition = 'stroke-dashoffset 0.8s ease-out'; pathRef.current.style.strokeDashoffset = '0'; }}, 100); }}, [data, chartWidth]);
    const hoveredPoint = hoveredIndex !== null && dataPoints[hoveredIndex] ? dataPoints[hoveredIndex] : null;
    const tooltipXOffset = useMemo(() => { if (!hoveredPoint || !chartWidth) return 0; const tw = 100, p = 10, hw = tw/2; if (hoveredPoint.x < hw + p) return (hw + p) - hoveredPoint.x; if (hoveredPoint.x > chartWidth - hw - p) return (chartWidth - hw - p) - hoveredPoint.x; return 0; }, [hoveredPoint, chartWidth]);
    return (
        <div className="w-full h-80 relative">
            <svg ref={chartRef} viewBox={`0 0 ${chartWidth} ${svgHeight}`} className="w-full h-full" onMouseLeave={() => onHover(null)}>
                <defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={gradientColor} stopOpacity={0.4} /><stop offset="95%" stopColor={gradientColor} stopOpacity={0.05} /></linearGradient></defs>
                {yAxisValues.map((v, i) => { if (v === 0 && i !== 0) return null; const y = yTopPadding + chartDrawableHeight - (v / yAxisMax) * chartDrawableHeight; return (<g key={i}><line x1={xPadding} y1={y} x2={chartWidth - xPadding} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeDasharray="4" strokeWidth="1" /><text x={xPadding - 8} y={y + 4} textAnchor="end" className="text-xs font-medium text-gray-400 dark:text-gray-500 fill-current">{v}</text></g>)})}
                <path d={areaPath} fill="url(#chartGradient)" />
                <path ref={pathRef} d={linePath} fill="none" stroke={lineColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {dataPoints.map((p, i) => (<g key={i} onMouseEnter={() => onHover(i)}><rect x={p.x - 12} y={0} width="24" height={svgHeight} fill="transparent" />{hoveredIndex === i && <circle cx={p.x} cy={p.y} r="10" fill={lineColor} className="opacity-25" />}<circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 6 : 0} className="fill-white dark:fill-gray-800 transition-all duration-200" stroke={lineColor} strokeWidth="2.5" /></g>))}
                {labels.map((l, i) => dataPoints[i] && <text key={i} x={dataPoints[i].x} y={svgHeight - yBottomPadding / 2} textAnchor="middle" className={`text-xs font-medium fill-current transition-colors ${hoveredIndex === i ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{l}</text>)}
                {hoveredPoint && (<g className="pointer-events-none" style={{ transition: 'transform 0.1s ease-out', transform: `translateX(${hoveredPoint.x}px)` }}><line x1="0" y1={hoveredPoint.y} x2="0" y2={yTopPadding + chartDrawableHeight} stroke={lineColor} strokeWidth="1.5" strokeDasharray="3" /><g transform={`translate(${tooltipXOffset}, ${hoveredPoint.y})`}><g transform={`translate(0, -55)`}><rect x="-50" y="0" width="100" height="40" rx="8" className="fill-gray-900 dark:fill-black" style={{filter: 'drop-shadow(0 5px 10px rgb(0 0 0 / 0.2))'}} /><text x="0" y="16" textAnchor="middle" className="fill-white font-bold text-base">{hoveredPoint.value} {yAxisLabel}</text><text x="0" y="30" textAnchor="middle" className="fill-gray-400 text-xs font-medium uppercase tracking-wider">{labels[hoveredIndex!]}</text></g></g></g>)}
            </svg>
        </div>
    );
};

const DesignSectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, icon, children, isOpen, onToggle }) => (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <button onClick={onToggle} className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors" aria-expanded={isOpen}>
            <div className="flex items-center gap-3"><h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{title}</h3></div>
            <ChevronUpIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
        {isOpen && <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700"><div className="mt-4">{children}</div></div>}
    </div>
);

const ColorInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
            <input type="color" value={value} onChange={onChange} className="w-10 h-10 p-1 border-none bg-transparent cursor-pointer" style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }} />
            <input type="text" value={value.toUpperCase()} onChange={onChange} className="w-full bg-gray-50 dark:bg-gray-700/80 border-none focus:ring-0 px-3 py-2 text-sm" />
        </div>
    </div>
);

const ImageUpload: React.FC<{ label: string; imageUrl: string | null; onImageUrlChange: (url: string | null) => void; storagePath: string; }> = ({ label, imageUrl, onImageUrlChange, storagePath }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) { alert('Please select a valid image file.'); return; }
            if (file.size > 2 * 1024 * 1024) { alert('File size should not exceed 2MB.'); return; }
            
            setIsUploading(true);
            try {
                const storageRef = storage.ref(`${storagePath}/${file.name}_${Date.now()}`);
                await storageRef.put(file);
                const downloadURL = await storageRef.getDownloadURL();
                onImageUrlChange(downloadURL);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Image upload failed. Please try again.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
                    {imageUrl ? <img src={imageUrl} alt={`${label} preview`} className="w-full h-full object-contain p-1 rounded-lg" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
                </div>
                <div className="flex-grow">
                    <input type="file" ref={inputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50">
                        <UploadIcon className="w-4 h-4" />
                        <span>{isUploading ? 'Uploading...' : 'Upload...'}</span>
                    </button>
                    {imageUrl && <button type="button" onClick={() => onImageUrlChange(null)} className="ml-3 text-sm font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Remove</button>}
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Recommended: PNG, JPG, SVG. Max 2MB.</p>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, initialContent, initialCategories }) => {
    const [activeTab, setActiveTab] = useState('Content');
    const [contentItems, setContentItems] = useState<ContentItem[]>(initialContent);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<ContentItem | null>(null);

    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
    const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] = useState(false);

    const designContext = useDesign();
    const [openSections, setOpenSections] = useState({ general: true, color: true, media: true, seo: true });
    
    useEffect(() => { const handleVisibilityChange = () => { if (document.hidden) { onLogout(); } }; document.addEventListener('visibilitychange', handleVisibilityChange); return () => document.removeEventListener('visibilitychange', handleVisibilityChange); }, [onLogout]);
    
    useEffect(() => {
        if (activeTab === 'Messages') {
            const unsubscribe = db.collection('messages')
                .orderBy('createdAt', 'desc')
                .onSnapshot(snapshot => {
                    const messagesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Message[];
                    setMessages(messagesData);
                    setIsMessagesLoading(false);
                }, err => {
                    console.error("Error fetching messages:", err);
                    setIsMessagesLoading(false);
                });
            
            return () => unsubscribe();
        }
    }, [activeTab]);

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        await db.collection('messages').doc(id).update({ read: isRead });
    };

    const handleDeleteMessage = (message: Message) => {
        setDeletingMessage(message);
        setIsMessageDeleteModalOpen(true);
    };
    
    const handleConfirmMessageDelete = async () => {
        if (!deletingMessage) return;
        try {
            await db.collection('messages').doc(deletingMessage.id).delete();
            setMessages(prev => prev.filter(msg => msg.id !== deletingMessage.id));
            setIsMessageDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete the message. Please check the console for details or verify your permissions.");
            setIsMessageDeleteModalOpen(false);
        } finally {
            setDeletingMessage(null);
        }
    };
    
    const handleSaveDesign = async () => {
        try {
            const designData = {
                siteName: designContext.siteName,
                heroTitle: designContext.heroTitle,
                heroSubtitle: designContext.heroSubtitle,
                footerSubtitle: designContext.footerSubtitle,
                primaryColor: designContext.primaryColor,
                secondaryColor: designContext.secondaryColor,
                accentColor: designContext.accentColor,
                logoUrl: designContext.logoUrl,
                faviconUrl: designContext.faviconUrl,
                metaTitle: designContext.metaTitle,
                metaDescription: designContext.metaDescription,
                metaKeywords: designContext.metaKeywords,
            };
            await db.collection("settings").doc("designConfig").set(designData);
            alert('Design settings saved successfully!');
        } catch (error) {
            console.error("Error saving design settings:", error);
            alert("Failed to save design settings.");
        }
    };
    
    const handleEdit = (item: ContentItem) => { setEditingItem(item); setIsEditModalOpen(true); };
    const handleDelete = (item: ContentItem) => { setDeletingItem(item); setIsDeleteModalOpen(true); };

    const handleSaveItem = async (savedItemData: Partial<ContentItem>) => {
        try {
            if (isEditModalOpen && editingItem) {
                await db.collection('content').doc(editingItem.id as string).update(savedItemData);
                setContentItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...savedItemData } : i));
            } else {
                const newItemData = {
                    text: savedItemData.text || '',
                    tags: savedItemData.tags || [],
                    views: 0, likes: 0, shares: 0,
                    createdAt: new Date().toISOString(),
                    featured: savedItemData.featured || false,
                };
                const docRef = await db.collection('content').add(newItemData);
                setContentItems(prev => [{ ...newItemData, id: docRef.id } as ContentItem, ...prev]);
            }
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save content.");
        }
    };
    
    const handleConfirmDelete = async () => {
        if (deletingItem?.id) {
            try {
                await db.collection('content').doc(deletingItem.id as string).delete();
                setContentItems(prev => prev.filter(i => i.id !== deletingItem.id));
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete content.");
            }
        }
    };

    const handleEditCategory = (category: Category) => { setEditingCategory(category); setIsCategoryFormOpen(true); };
    const handleDeleteCategory = (category: Category) => { setDeletingCategory(category); setIsCategoryDeleteModalOpen(true); };

    const handleSaveCategory = async (savedCategoryData: Omit<Category, 'id'>) => {
        try {
            if (editingCategory) {
                await db.collection('categories').doc(editingCategory.id).update(savedCategoryData);
                setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...savedCategoryData } : c));
            } else {
                const docRef = await db.collection('categories').add(savedCategoryData);
                setCategories(prev => [{ ...savedCategoryData, id: docRef.id }, ...prev]);
            }
            setIsCategoryFormOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category.");
        }
    };
    
    const handleConfirmCategoryDelete = async () => {
        if (deletingCategory?.id) {
            try {
                await db.collection('categories').doc(deletingCategory.id).delete();
                setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
                setIsCategoryDeleteModalOpen(false);
                setDeletingCategory(null);
            } catch (error) {
                console.error("Error deleting category:", error);
                alert("Failed to delete category.");
            }
        }
    };

    const filteredContent = useMemo(() => contentItems.filter(item => (categoryFilter === 'all' || item.tags.includes(categoryFilter)) && (searchQuery.trim() === '' || item.text.toLowerCase().includes(searchQuery.toLowerCase()))), [contentItems, categoryFilter, searchQuery]);
    const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);
    const paginatedContent = useMemo(() => { const start = (currentPage - 1) * ITEMS_PER_PAGE; return filteredContent.slice(start, start + ITEMS_PER_PAGE); }, [filteredContent, currentPage]);
    useEffect(() => { if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages); else if (totalPages > 0 && currentPage < 1) setCurrentPage(1); }, [currentPage, totalPages]);

    const handleSelectItem = (itemId: string) => { setSelectedItems(prev => { const newSet = new Set(prev); if (newSet.has(itemId)) newSet.delete(itemId); else newSet.add(itemId); return newSet; }); };
    const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => { const pageIds = new Set(paginatedContent.map(item => item.id as string)); if(e.target.checked) setSelectedItems(prev => new Set([...prev, ...pageIds])); else setSelectedItems(prev => { const newSet = new Set(prev); pageIds.forEach(id => newSet.delete(id)); return newSet; }); };

    const handleConfirmBulkDelete = async () => {
        const batch = db.batch();
        selectedItems.forEach(id => batch.delete(db.collection('content').doc(id)));
        try {
            await batch.commit();
            setContentItems(prev => prev.filter(item => !selectedItems.has(item.id as string)));
            setSelectedItems(new Set());
            setIsBulkDeleteModalOpen(false);
        } catch (error) {
            console.error("Error in bulk delete:", error);
            alert("Failed to delete selected items.");
        }
    };
    const handleBulkFeatureToggle = async (featured: boolean) => {
        const batch = db.batch();
        selectedItems.forEach(id => batch.update(db.collection('content').doc(id), { featured }));
        try {
            await batch.commit();
            setContentItems(prev => prev.map(item => selectedItems.has(item.id as string) ? { ...item, featured } : item));
            setSelectedItems(new Set());
        } catch (error) {
            console.error("Error updating feature status:", error);
            alert("Failed to update items.");
        }
    };

    const [activityFilter, setActivityFilter] = useState('Views');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const stats = useMemo(() => contentItems.reduce((acc, item) => ({ totalViews: acc.totalViews + item.views, totalLikes: acc.totalLikes + item.likes, totalShares: acc.totalShares + (item.shares || 0) }), { totalViews: 0, totalLikes: 0, totalShares: 0 }), [contentItems]);
    const topPerformingContent = useMemo(() => [...contentItems].sort((a, b) => (b.views + (b.likes * 2) + (b.shares || 0) * 3) - (a.views + (a.likes * 2) + (a.shares || 0) * 3)).slice(0, 5), [contentItems]);
    const categoryColors: { [key: string]: string } = { bio: '#ec4899', shayari: '#a855f7', 'love-quotes': '#ef4444', 'fun-facts': '#22c55e', captions: '#f59e0b' };
    const popularCategories = useMemo(() => { const counts: { [k: string]: number } = {}; contentItems.forEach(item => { const catId = item.tags[0]; if (catId) counts[catId] = (counts[catId] || 0) + 1; }); const max = Math.max(...Object.values(counts), 1); return Object.entries(counts).map(([id, count]) => ({ id, name: categories.find(c => c.id === id)?.name || 'Unknown', count, percentage: (count / max) * 100, color: categoryColors[id] || '#6b7280' })).sort((a, b) => b.count - a.count).slice(0, 5); }, [contentItems, categories]);
    
    const chartLabels = useMemo(() => {
        const labels = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        return labels;
    }, []);

    const activityData = useMemo(() => {
        const weeklyData = Array(7).fill(0);
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - (6 - i));
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const itemsFromDay = contentItems.filter(item => {
                const itemDate = new Date(item.createdAt);
                return itemDate >= startOfDay && itemDate <= endOfDay;
            });
            
            if (activityFilter === 'Views') {
                weeklyData[i] = itemsFromDay.reduce((sum, item) => sum + item.views, 0);
            } else if (activityFilter === 'Likes') {
                weeklyData[i] = itemsFromDay.reduce((sum, item) => sum + item.likes, 0);
            } else if (activityFilter === 'Shares') {
                weeklyData[i] = itemsFromDay.reduce((sum, item) => sum + (item.shares || 0), 0);
            }
        }
        
        if (activityFilter === 'Views') return { data: weeklyData, color: '#3b82f6' };
        if (activityFilter === 'Likes') return { data: weeklyData, color: '#ec4899' };
        return { data: weeklyData, color: '#22c55e' };
    }, [activityFilter, contentItems]);

    const percentageChange = useMemo(() => { const data = activityData.data; if(data.length < 2) return { value: 0, isPositive: true }; const first = data[0], last = data[data.length-1]; if(first === 0) return { value: last > 0 ? 100 : 0, isPositive: last > 0 }; const change = ((last - first) / first) * 100; return { value: Math.abs(Math.round(change)), isPositive: change >= 0 }; }, [activityData.data]);
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header onLogout={onLogout} isAdminPage={true} onSearchClick={() => {}} showSearchIcon={false} />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your site's content, design, and analytics.</p>
                        </div>
                        <div className="flex-shrink-0">
                            {activeTab === 'Content' && <button onClick={() => { setEditingItem(null); setIsAddModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}><AddIcon className="w-4 h-4" /><span>Add Content</span></button>}
                            {activeTab === 'Categories' && <button onClick={() => { setEditingCategory(null); setIsCategoryFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}><AddIcon className="w-4 h-4" /><span>Add Category</span></button>}
                            {activeTab === 'Design' && <button onClick={handleSaveDesign} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors" style={{ backgroundColor: 'var(--color-primary)' }}><SaveIcon className="w-4 h-4" /><span>Save Changes</span></button>}
                        </div>
                    </div>
                    <div className="mb-6"><div className="border-b border-gray-200 dark:border-gray-700"><nav className="-mb-px flex space-x-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Tabs">{TABS.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === tab ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}>{tab}</button>)}</nav></div></div>
                    <div>
                        {activeTab === 'Content' && (
                             <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 justify-between">
                                    <div className="relative flex-grow"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div><input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search content..." className="w-full bg-gray-100 dark:bg-gray-700/80 border-transparent focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] rounded-lg py-2 pl-10 pr-4" /></div>
                                    <div className="flex-shrink-0"><select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="w-full lg:w-48 bg-gray-100 dark:bg-gray-700/80 border-transparent focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] rounded-lg py-2 pl-3 pr-8"><option value="all">All Categories</option>{categories.filter(c => !c.premium).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                </div>
                                {selectedItems.size > 0 && <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-xl border border-purple-200 dark:border-purple-700 flex flex-wrap items-center justify-between gap-4"><p className="text-sm font-semibold text-purple-800 dark:text-purple-200">{selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected</p><div className="flex flex-wrap gap-2"><button onClick={() => handleBulkFeatureToggle(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-yellow-400 text-yellow-900 hover:bg-yellow-500"><StarIcon className="w-4 h-4"/> Mark as Featured</button><button onClick={() => handleBulkFeatureToggle(false)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"><StarOffIcon className="w-4 h-4"/> Unmark Featured</button><button onClick={() => setIsBulkDeleteModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-500 text-white hover:bg-red-600"><TrashIcon className="w-4 h-4"/> Delete Selected</button></div></div>}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {paginatedContent.length > 0 && <div className="xl:col-span-2 flex items-center gap-4 bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700"><input type="checkbox" checked={paginatedContent.length > 0 && paginatedContent.every(item => selectedItems.has(item.id as string))} onChange={handleSelectAllOnPage} className="h-5 w-5 rounded border-gray-300 dark:border-gray-500 text-[var(--color-primary)] focus:ring-[var(--color-accent)] cursor-pointer" aria-label="Select all on page" /><label className="font-semibold">Select all on page</label></div>}
                                    {paginatedContent.map(item => <AdminContentCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} isSelected={selectedItems.has(item.id as string)} onSelect={() => handleSelectItem(item.id as string)} categories={categories} />)}
                                </div>
                                {filteredContent.length > ITEMS_PER_PAGE && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
                                {filteredContent.length === 0 && <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Content Found</h3><p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter.</p></div>}
                            </div>
                        )}
                        {activeTab === 'Categories' && (
                             <div className="space-y-4">
                                {categories.length > 0 ? (
                                    categories.map(category => (
                                        <AdminCategoryCard 
                                            key={category.id} 
                                            category={category} 
                                            onEdit={handleEditCategory}
                                            onDelete={handleDeleteCategory}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center">
                                        <CategoryIcon className="w-12 h-12 text-gray-400 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Categories Found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Add Category" to create your first one.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'Messages' && (
                            <div className="space-y-4">
                                {isMessagesLoading ? (
                                    <p>Loading messages...</p>
                                ) : messages.length > 0 ? (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`p-4 rounded-lg border transition-colors ${msg.read ? 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50'}`}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{msg.name}</h4>
                                                        <a href={`mailto:${msg.email}`} className="text-sm text-purple-600 dark:text-purple-400 hover:underline break-all">{msg.email}</a>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                                                    <button onClick={() => handleMarkAsRead(msg.id, !msg.read)} className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${msg.read ? 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300' : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-300'}`}>
                                                        <MailIcon className="w-4 h-4" />
                                                        <span className="hidden sm:inline">{msg.read ? 'Mark as Unread' : 'Mark as Read'}</span>
                                                        <span className="sm:hidden">{msg.read ? 'Unread' : 'Read'}</span>
                                                    </button>
                                                    <button onClick={() => handleDeleteMessage(msg)} className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 hover:bg-red-200 transition-colors">
                                                        <TrashIcon className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                        <span className="sm:hidden">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 min-h-[40vh] flex flex-col items-center justify-center">
                                        <MessageIcon className="w-12 h-12 text-gray-400 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Messages Yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">New messages from the contact form will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'Design' && (
                             <div className="space-y-6 max-w-4xl mx-auto">
                                <DesignSectionCard title="General Settings" icon={<SettingsIcon className="w-6 h-6 text-gray-500" />} isOpen={openSections.general} onToggle={() => setOpenSections(s => ({ ...s, general: !s.general }))}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label><input type="text" id="siteName" value={designContext.siteName} onChange={e => designContext.setSiteName(e.target.value)} className="mt-1 block w-full input-style" /></div>
                                        <div><label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hero Title</label><input type="text" id="heroTitle" value={designContext.heroTitle} onChange={e => designContext.setHeroTitle(e.target.value)} className="mt-1 block w-full input-style" /></div>
                                        <div className="md:col-span-2"><label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hero Subtitle</label><textarea id="heroSubtitle" value={designContext.heroSubtitle} onChange={e => designContext.setHeroSubtitle(e.target.value)} rows={2} className="mt-1 block w-full input-style resize-none overflow-hidden"></textarea></div>
                                        <div className="md:col-span-2"><label htmlFor="footerSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Footer Subtitle</label><textarea id="footerSubtitle" value={designContext.footerSubtitle} onChange={e => designContext.setFooterSubtitle(e.target.value)} rows={2} className="mt-1 block w-full input-style resize-none overflow-hidden"></textarea></div>
                                    </div>
                                </DesignSectionCard>
                                <DesignSectionCard title="Color Palette" icon={<PaletteIcon className="w-6 h-6 text-gray-500" />} isOpen={openSections.color} onToggle={() => setOpenSections(s => ({ ...s, color: !s.color }))}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <ColorInput label="Primary Color" value={designContext.primaryColor} onChange={e => designContext.setPrimaryColor(e.target.value)} />
                                        <ColorInput label="Secondary Color" value={designContext.secondaryColor} onChange={e => designContext.setSecondaryColor(e.target.value)} />
                                        <ColorInput label="Accent Color" value={designContext.accentColor} onChange={e => designContext.setAccentColor(e.target.value)} />
                                    </div>
                                </DesignSectionCard>
                                <DesignSectionCard title="Media & Branding" icon={<ImageIcon className="w-6 h-6 text-gray-500" />} isOpen={openSections.media} onToggle={() => setOpenSections(s => ({ ...s, media: !s.media }))}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ImageUpload label="Logo Image" imageUrl={designContext.logoUrl} onImageUrlChange={designContext.setLogoUrl} storagePath="logos" />
                                        <ImageUpload label="Favicon Image" imageUrl={designContext.faviconUrl} onImageUrlChange={designContext.setFaviconUrl} storagePath="favicons" />
                                    </div>
                                </DesignSectionCard>
                                <DesignSectionCard title="SEO & Metadata" icon={<TagIcon className="w-6 h-6 text-gray-500" />} isOpen={openSections.seo} onToggle={() => setOpenSections(s => ({ ...s, seo: !s.seo }))}>
                                    <div className="space-y-6">
                                        <div><label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Title</label><input type="text" id="metaTitle" value={designContext.metaTitle} onChange={e => designContext.setMetaTitle(e.target.value)} className="mt-1 block w-full input-style" /></div>
                                        <div><label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Description</label><textarea id="metaDescription" value={designContext.metaDescription} onChange={e => designContext.setMetaDescription(e.target.value)} rows={2} className="mt-1 block w-full input-style resize-none overflow-hidden"></textarea></div>
                                        <div><label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Keywords</label><input type="text" id="metaKeywords" value={designContext.metaKeywords} onChange={e => designContext.setMetaKeywords(e.target.value)} placeholder="keyword1, keyword2" className="mt-1 block w-full input-style" /></div>
                                    </div>
                                </DesignSectionCard>
                            </div>
                        )}
                        {activeTab === 'Stats' && (
                           <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard icon={<ContentIcon />} title="Total Content" value={contentItems.length} colorClass={{bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400'}} />
                                    <StatCard icon={<EyeIcon />} title="Total Views" value={stats.totalViews.toLocaleString()} colorClass={{bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400'}} />
                                    <StatCard icon={<HeartIcon />} title="Total Likes" value={stats.totalLikes.toLocaleString()} colorClass={{bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-600 dark:text-pink-400'}} />
                                    <StatCard icon={<ShareIcon />} title="Total Shares" value={stats.totalShares.toLocaleString()} colorClass={{bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-600 dark:text-green-400'}} />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                            <div><h3 className="font-semibold text-lg text-gray-900 dark:text-white">Weekly Activity</h3><p className="text-sm text-gray-500 dark:text-gray-400">Activity on content created in the past 7 days.</p></div>
                                            <div className="flex-shrink-0 mt-2 sm:mt-0"><select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg text-sm font-semibold focus:ring-purple-500 focus:border-purple-500"><option>Views</option><option>Likes</option><option>Shares</option></select></div>
                                        </div>
                                        {hoveredIndex === null && <div className="flex items-center gap-2 mb-2"><p className="text-3xl font-bold">{activityData.data.reduce((a, b) => a + b, 0).toLocaleString()}</p><div className={`flex items-center text-sm font-semibold ${percentageChange.isPositive ? 'text-green-500' : 'text-red-500'}`}>{percentageChange.isPositive ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}<span>{percentageChange.value}% vs first day</span></div></div>}
                                        <LineChart data={activityData.data} labels={chartLabels} lineColor={activityData.color} gradientColor={activityData.color} onHover={setHoveredIndex} hoveredIndex={hoveredIndex} yAxisLabel={activityFilter.slice(0, -1)} />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Top Categories</h3><div className="space-y-4">{popularCategories.map(cat => <CategoryProgressBar key={cat.id} name={cat.name} value={cat.count} percentage={cat.percentage} color={cat.color} />)}</div></div>
                                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700"><h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Top Content</h3><ul className="space-y-3">{topPerformingContent.map(item => <li key={item.id} className="text-sm text-gray-600 dark:text-gray-300 truncate"><span className="font-medium text-gray-800 dark:text-gray-100">{item.views + (item.likes*2)} pts</span> - {item.text}</li>)}</ul></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <ContentFormModal isOpen={isAddModalOpen || isEditModalOpen} onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} onSave={handleSaveItem} item={editingItem} categories={categories} />
            <CategoryFormModal isOpen={isCategoryFormOpen} onClose={() => { setIsCategoryFormOpen(false); setEditingCategory(null); }} onSave={handleSaveCategory} category={editingCategory} />
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Confirm Deletion" message="This action cannot be undone. The content will be permanently removed from the database." confirmText="Delete Content" />
            <DeleteConfirmationModal isOpen={isCategoryDeleteModalOpen} onClose={() => setIsCategoryDeleteModalOpen(false)} onConfirm={handleConfirmCategoryDelete} title="Delete Category" message="Are you sure? Deleting a category will not delete its content, but may cause display issues if content is not re-categorized." confirmText="Delete Category" />
            <DeleteConfirmationModal isOpen={isMessageDeleteModalOpen} onClose={() => setIsMessageDeleteModalOpen(false)} onConfirm={handleConfirmMessageDelete} title="Delete Message" message="Are you sure you want to delete this message permanently? This action cannot be undone." confirmText="Delete Message" />
            <BulkDeleteConfirmationModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleConfirmBulkDelete} itemCount={selectedItems.size} />
            <style>{`.input-style { background-color: #F9FAFB; border-color: #D1D5DB; border-width: 1px; border-radius: 0.5rem; padding: 0.5rem 0.75rem; } .dark .input-style { background-color: #374151; border-color: #4B5563; color: #D1D5DB; }`}</style>
        </div>
    );
};

export default AdminDashboard;