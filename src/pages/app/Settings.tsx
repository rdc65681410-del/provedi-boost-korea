import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Building2,
  Bell,
  Lock,
  CreditCard,
  Link2,
  Shield,
  Save,
  Camera,
  BarChart3,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // 프로필 정보
  const [profile, setProfile] = useState({
    name: "김지민",
    email: "jimin@example.com",
    phone: "010-1234-5678",
    company: "홈앤리빙",
  });

  // 알림 설정
  const [notifications, setNotifications] = useState({
    emailCampaign: true,
    emailReport: true,
    emailPayment: false,
    pushCampaign: true,
    pushReport: false,
  });

  // 비밀번호 변경
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setProfile(prev => ({
          ...prev,
          email: user.email || "",
        }));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // 프로필 업데이트 로직
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("프로필이 저장되었습니다");
    } catch (error) {
      toast.error("프로필 저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("알림 설정이 저장되었습니다");
    } catch (error) {
      toast.error("알림 설정 저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("새 비밀번호가 일치하지 않습니다");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      toast.success("비밀번호가 변경되었습니다");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error("비밀번호 변경에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-muted-foreground">
          계정 정보와 알림 설정을 관리하세요
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            알림
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            보안
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            결제
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link2 className="h-4 w-4 mr-2" />
            연동
          </TabsTrigger>
        </TabsList>

        {/* 프로필 탭 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>
                회원님의 기본 정보를 관리합니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 프로필 사진 */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    사진 변경
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG 파일, 최대 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* 기본 정보 */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    이름
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="010-1234-5678"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    회사명
                  </Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    placeholder="회사명을 입력하세요"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "저장 중..." : "변경사항 저장"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 탭 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>이메일 알림</CardTitle>
              <CardDescription>
                이메일로 받을 알림을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>캠페인 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    캠페인 시작, 종료 및 성과 알림
                  </p>
                </div>
                <Switch
                  checked={notifications.emailCampaign}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailCampaign: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>리포트 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    주간/월간 리포트 발송 알림
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReport: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>결제 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    결제 관련 알림 및 영수증
                  </p>
                </div>
                <Switch
                  checked={notifications.emailPayment}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailPayment: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>푸시 알림</CardTitle>
              <CardDescription>
                브라우저 푸시 알림 설정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>캠페인 상태 변경</Label>
                  <p className="text-sm text-muted-foreground">
                    게시 완료, 높은 참여율 등
                  </p>
                </div>
                <Switch
                  checked={notifications.pushCampaign}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushCampaign: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>리포트 생성 완료</Label>
                  <p className="text-sm text-muted-foreground">
                    새로운 리포트가 준비되었을 때
                  </p>
                </div>
                <Switch
                  checked={notifications.pushReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushReport: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "저장 중..." : "알림 설정 저장"}
          </Button>
        </TabsContent>

        {/* 보안 탭 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>
                안전한 비밀번호로 계정을 보호하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="최소 6자 이상"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>

              <Button onClick={handleChangePassword} disabled={loading} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>계정 보안</CardTitle>
              <CardDescription>
                추가 보안 옵션
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>2단계 인증 (준비중)</Label>
                  <p className="text-sm text-muted-foreground">
                    추가 보안 레이어로 계정 보호
                  </p>
                </div>
                <Switch disabled />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>로그인 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    새로운 기기에서 로그인 시 알림
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 결제 탭 */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
              <CardDescription>
                등록된 결제 수단을 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  등록된 결제 수단이 없습니다
                </p>
                <Button variant="outline">
                  결제 수단 추가
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>
                최근 결제 내역을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  결제 내역이 없습니다
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 연동 탭 */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>채널톡 연동</CardTitle>
              <CardDescription>
                채널톡을 연동하여 고객 문의 및 상담 관리를 자동화하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-medium">채널톡</p>
                    <p className="text-sm text-muted-foreground">연동 안됨</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Link2 className="h-4 w-4 mr-2" />
                  연동하기
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>실시간 고객 지원:</strong> 채널톡을 연동하면 고객 문의를 실시간으로 관리하고 캠페인 관련 상담을 효율적으로 처리할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>분석 도구 연동</CardTitle>
              <CardDescription>
                트래픽 분석 및 전환 추적을 위한 도구 연동
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Google Analytics</p>
                    <p className="text-sm text-muted-foreground">연동 안됨</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  연동하기
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">네이버 애널리틱스</p>
                    <p className="text-sm text-muted-foreground">연동 안됨</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  연동하기
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>워크플로우 자동화</CardTitle>
              <CardDescription>
                Zapier를 통한 맞춤 자동화 워크플로우
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Link2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Zapier</p>
                    <p className="text-sm text-muted-foreground">다양한 앱과 연동 가능</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  설정하기
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Zapier Webhook URL</strong>
                </p>
                <Input
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Zapier에서 Webhook 트리거를 생성하고 URL을 입력하세요
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API 키</CardTitle>
              <CardDescription>
                외부 서비스 연동을 위한 API 키
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input
                  value="pk_live_••••••••••••••••••••••••••"
                  disabled
                  className="font-mono text-sm"
                />
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  재발급
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                API 키는 안전하게 보관하세요. 외부에 노출되지 않도록 주의하세요.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
