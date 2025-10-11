'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/contexts/MemberContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Calendar, Star, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { member, loading, updateProfile, refreshMember } = useMember();
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
        title: 'Profil aktualisiert',
        description: 'Deine Änderungen wurden erfolgreich gespeichert.',
      });
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message || 'Profil konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  const memberSince = member.createdAt ? new Date(member.createdAt).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Unbekannt';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Mein Profil</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
              <CardDescription>
                Verwalte deine Profil-Informationen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  E-Mail-Adresse kann nicht geändert werden
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="username">Benutzername</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Anzeigename</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Über mich</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  maxLength={500}
                  placeholder="Erzähle etwas über dich..."
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/500 Zeichen
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Profil bearbeiten</Button>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Speichern
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
                      Abbrechen
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
                <CardTitle className="text-lg">Statistiken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{member.favorites?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Favoriten</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{member.reviews?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Bewertungen</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mitglied seit</p>
                    <p className="text-xs text-muted-foreground">{memberSince}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schnellzugriff</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    Meine Favoriten
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        {member.reviews && member.reviews.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Meine Bewertungen</CardTitle>
              <CardDescription>
                Du hast {member.reviews.length} Bewertung(en) geschrieben
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.reviews.map((review: any) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/s/${review.service?.slug}`}
                          className="font-semibold hover:text-primary"
                        >
                          {review.service?.name || 'Service'}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.voting
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.reviewtext}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

