'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/contexts/MemberContext';
import { Member } from '@/types/member';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Calendar, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations();
  const { status } = useSession();
  const router = useRouter();
  const { member, favorites, loading, updateProfile, refreshMember } = useMember();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (member) {
      setFormData({
        username: member.username || '',
        displayName: member.displayName || '',
        bio: member.bio || '',
      });
    }
  }, [member]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      await refreshMember();
      setIsEditing(false);
      toast({
        title: t('profile.updated'),
        description: t('profile.updatedDescription'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('profile.updateError'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || status === 'loading' || !member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  const memberSince = member.createdAt ? new Date(member.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : t('profile.unknown');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">{t('profile.myProfile')}</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>
                {t('profile.manageInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('profile.emailCannotChange')}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="username">{t('profile.username')}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">{t('profile.displayName')}</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('profile.aboutMe')}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  maxLength={500}
                  placeholder={t('profile.tellAboutYourself')}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/500 {t('profile.characters')}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>{t('profile.editProfile')}</Button>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('common.save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: member.username || '',
                          displayName: member.displayName || '',
                          bio: member.bio || '',
                        });
                      }}
                      disabled={isSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('profile.statistics')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className="text-sm text-muted-foreground">{t('nav.favorites')}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(member as Member & { statistics?: { reviewCount: number } }).statistics?.reviewCount || 0}</p>
                    <p className="text-sm text-muted-foreground">{t('app.reviews')}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('profile.memberSince')}</p>
                    <p className="text-xs text-muted-foreground">{memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('profile.quickAccess')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('auth.myFavorites')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section - TODO: Implement reviews fetching and display */}
      </div>
      <Footer />
    </div>
  );
}

