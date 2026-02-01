import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from '../ui/sonner';

interface PersonalData {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  birthDate: string;
}

export function PersonalDataSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setToken } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    birth_date: '',
    monthly_income: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        city: (user as any).city || '',
        birth_date: user?.birth_date ? user.birth_date.split('T')[0] : '',
        monthly_income: (user as any).monthly_income || 0
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDateForInput = (dateStr: any) => {
    if (!dateStr) return "";
    return dateStr.split('T')[0]; 
  };

  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return 'Не указана';
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    if (!year || !month || !day) return dateString;
    return `${day}.${month}.${year}`;
  };

  const handleSave = async() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    setIsLoading(true);
    try {
      await api.updateProfile(token, {
        full_name: formData.full_name,
        city: formData.city,
        phone: formData.phone,
        birth_date: formData.birth_date,
        monthly_income: Number(formData.monthly_income) || 0
      }); 
      await setToken(token);
      setIsEditing(false);
      toast.success('Данные успешно сохранены');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка сохранения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Личные данные</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
            <Button onClick={() => handleSave()} disabled={isLoading}>
              Сохранить
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" /> Имя
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" /> Фамилия
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div> */}

        {/* <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" /> Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div> */}
        
        {/* Email — только для чтения */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" /> Email
          </Label>
          <div className="px-3 py-2 bg-muted/50 rounded-md border border-border text-foreground cursor-not-allowed">
            {user?.email || 'Не указан'}
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" /> Телефон
          </Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="city" className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" /> Город
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" /> Дата рождения
          </Label>
          <Input
            id="birthDate"
            type={isEditing ? "date" : "text"}
            value={isEditing 
              ? formatDateForInput(formData.birth_date) 
              : formatDateForDisplay(formData.birth_date)
            }
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            disabled={!isEditing}
            className="bg-muted/50"
          />
        </div>
      </div>
    </div>
  );
}
