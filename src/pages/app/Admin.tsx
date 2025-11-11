import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle2, 
  Clock, 
  Copy,
  Calendar,
  FileText,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [generatedContents, setGeneratedContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error("주문 목록을 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setIsLoading(true);

      // 주문 아이템 가져오기
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;
      setOrderItems(items || []);

      // 생성된 콘텐츠 가져오기
      if (items && items.length > 0) {
        const itemIds = items.map(item => item.id);
        const { data: contents, error: contentsError } = await supabase
          .from('generated_contents')
          .select('*')
          .in('order_item_id', itemIds)
          .order('scheduled_date', { ascending: true })
          .order('scheduled_time', { ascending: true });

        if (contentsError) throw contentsError;
        setGeneratedContents(contents || []);
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast.error("주문 상세 정보를 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었습니다");
    } catch (error) {
      toast.error("복사에 실패했습니다");
    }
  };

  const updateContentStatus = async (contentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('generated_contents')
        .update({ 
          status,
          ...(status === 'posted' && { posted_at: new Date().toISOString() })
        })
        .eq('id', contentId);

      if (error) throw error;

      // 목록 새로고침
      if (selectedOrder) {
        fetchOrderDetails(selectedOrder.id);
      }
      
      toast.success("상태가 업데이트되었습니다");
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("상태 업데이트에 실패했습니다");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "대기중", variant: "secondary" as const },
      posted: { label: "포스팅 완료", variant: "default" as const },
      processing: { label: "처리중", variant: "outline" as const },
      completed: { label: "완료", variant: "default" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">관리자 대시보드</h1>
        <p className="text-muted-foreground">
          주문 목록과 자동 생성된 콘텐츠를 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 주문 목록 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              주문 목록
            </CardTitle>
            <CardDescription>{orders.length}개의 주문</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">로딩중...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">주문이 없습니다</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-all hover:border-accent ${
                      selectedOrder?.id === order.id ? 'border-accent bg-accent/5' : ''
                    }`}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{order.customer_name}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.customer_email}</p>
                          <p className="font-bold text-accent">
                            {order.final_amount.toLocaleString()}원
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 주문 상세 & 생성된 콘텐츠 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>주문 상세 & 생성된 콘텐츠</CardTitle>
            <CardDescription>
              {selectedOrder 
                ? `${selectedOrder.customer_name}님의 주문`
                : "왼쪽에서 주문을 선택하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedOrder ? (
              <p className="text-center text-muted-foreground py-12">
                주문을 선택하면 생성된 콘텐츠를 확인할 수 있습니다
              </p>
            ) : (
              <Tabs defaultValue="contents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="contents">
                    <FileText className="h-4 w-4 mr-2" />
                    생성된 콘텐츠
                  </TabsTrigger>
                  <TabsTrigger value="details">
                    <Package className="h-4 w-4 mr-2" />
                    주문 정보
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contents" className="space-y-4 mt-4">
                  {isLoading ? (
                    <p className="text-center py-8">로딩중...</p>
                  ) : generatedContents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      생성된 콘텐츠가 없습니다
                    </p>
                  ) : (
                    generatedContents.map((content) => (
                      <Card key={content.id} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{content.channel_name}</Badge>
                                <Badge>{content.content_type}</Badge>
                                {getStatusBadge(content.status)}
                              </div>
                              <CardTitle className="text-lg">{content.title}</CardTitle>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(`${content.title}\n\n${content.content}`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{content.scheduled_date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{content.scheduled_time}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm">{content.content}</p>
                          </div>
                          
                          {content.tags && content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {content.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary">#{tag}</Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2 pt-2 border-t">
                            {content.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateContentStatus(content.id, 'posted')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                포스팅 완료 처리
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(`${content.title}\n\n${content.content}`)}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              전체 복사
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>고객 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">이름</p>
                          <p className="font-semibold">{selectedOrder.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">회사</p>
                          <p className="font-semibold">{selectedOrder.customer_company || '-'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">이메일</p>
                          <p className="font-semibold">{selectedOrder.customer_email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">연락처</p>
                          <p className="font-semibold">{selectedOrder.customer_phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>주문 내역</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">상품 정보</p>
                        <p className="font-semibold">{selectedOrder.product_name}</p>
                        <a 
                          href={selectedOrder.product_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          상품 URL 보기
                        </a>
                      </div>

                      <div className="space-y-2">
                        {orderItems.map((item) => (
                          <div key={item.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold">{item.channel_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.content_type} · {item.post_count}개 포스팅
                                </p>
                              </div>
                              <p className="font-bold text-accent">
                                {item.total_price.toLocaleString()}원
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">소계</span>
                          <span>{selectedOrder.total_amount.toLocaleString()}원</span>
                        </div>
                        {selectedOrder.discount_amount > 0 && (
                          <div className="flex justify-between text-accent">
                            <span>할인</span>
                            <span>-{selectedOrder.discount_amount.toLocaleString()}원</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>최종 금액</span>
                          <span className="text-accent">
                            {selectedOrder.final_amount.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;