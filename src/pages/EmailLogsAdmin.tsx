import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, RefreshCw, Search, X } from "lucide-react";
import Layout from "@/components/Layout";

interface EmailLog {
  id: string;
  email_type: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  edge_function_name: string;
  metadata: any;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
}

interface RegisteredUser {
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

interface UserStatus {
  email: string;
  name: string | null;
  isSubscribed: boolean;
  isRegistered: boolean;
  registeredAt: string | null;
  subscribedAt: string | null;
}

const EmailLogsAdmin = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBackfilling, setIsBackfilling] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [userStatuses, setUserStatuses] = useState<UserStatus[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching email logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('id, email, name, created_at')
        .order('email', { ascending: true });

      if (error) throw error;
      setSubscribers(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      // Query profiles joined with auth data via RPC function
      const { data, error } = await supabase.rpc('get_user_emails_with_profiles');

      if (error) {
        console.error('RPC error, falling back to profiles only:', error);
        // Fallback: just get profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name');
        
        const users: RegisteredUser[] = (profiles || []).map(p => ({
          user_id: p.user_id,
          email: `user_${p.user_id.substring(0, 8)}`, // Placeholder
          display_name: p.display_name,
          created_at: new Date().toISOString(),
        }));
        
        setRegisteredUsers(users);
        return users;
      }

      setRegisteredUsers(data || []);
      return data || [];
    } catch (error: any) {
      console.error('Error fetching registered users:', error);
      return [];
    }
  };

  const combineUserStatuses = (subs: Subscriber[], users: RegisteredUser[]) => {
    const statusMap = new Map<string, UserStatus>();

    // Add subscribers
    subs.forEach(sub => {
      statusMap.set(sub.email, {
        email: sub.email,
        name: sub.name,
        isSubscribed: true,
        isRegistered: false,
        subscribedAt: null,
        registeredAt: null,
      });
    });

    // Add registered users
    users.forEach(user => {
      const existing = statusMap.get(user.email);
      if (existing) {
        existing.isRegistered = true;
        existing.registeredAt = user.created_at;
        existing.name = existing.name || user.display_name;
      } else {
        statusMap.set(user.email, {
          email: user.email,
          name: user.display_name,
          isSubscribed: false,
          isRegistered: true,
          subscribedAt: null,
          registeredAt: user.created_at,
        });
      }
    });

    setUserStatuses(Array.from(statusMap.values()).sort((a, b) => 
      a.email.localeCompare(b.email)
    ));
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLogs();
      const subs = await fetchSubscribers();
      const users = await fetchRegisteredUsers();
      combineUserStatuses(subs, users);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleBackfill = async (specificEmails?: string[]) => {
    setIsBackfilling(true);
    try {
      const body = specificEmails && specificEmails.length > 0 
        ? { emails: specificEmails }
        : {};

      const { data, error } = await supabase.functions.invoke('backfill-subscribers', { body });

      if (error) throw error;

      const emailCount = specificEmails?.length || data.summary.total;
      toast({
        title: "Backfill Complete",
        description: `Successfully processed ${data.summary.successful} out of ${emailCount} subscribers`,
      });

      // Refresh logs
      await fetchLogs();
      setShowEmailInput(false);
      setSelectedEmails([]);
      setInputValue("");
    } catch (error: any) {
      console.error('Error during backfill:', error);
      toast({
        title: "Backfill Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsBackfilling(false);
    }
  };

  const handleTargetedBackfill = () => {
    if (selectedEmails.length === 0) {
      toast({
        title: "No Emails Selected",
        description: "Please select at least one email address",
        variant: "destructive",
      });
      return;
    }

    handleBackfill(selectedEmails);
  };

  const handleAddEmail = (email: string) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemoveEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter(e => e !== email));
  };

  const filteredSubscribers = subscribers.filter(sub => 
    !selectedEmails.includes(sub.email) &&
    (sub.email.toLowerCase().includes(inputValue.toLowerCase()) ||
     sub.name?.toLowerCase().includes(inputValue.toLowerCase()))
  );

  const filteredLogs = logs.filter(log =>
    log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
    pending: logs.filter(l => l.status === 'pending').length,
  };

  const getStatusBadges = (status: UserStatus) => {
    const badges = [];
    
    if (status.isSubscribed && status.isRegistered) {
      badges.push(
        <Badge key="both" className="bg-gradient-to-r from-primary to-accent text-white">
          Newsletter + Account
        </Badge>
      );
    } else if (status.isSubscribed) {
      badges.push(
        <Badge key="newsletter" variant="secondary" className="bg-awareness text-white">
          Newsletter Only
        </Badge>
      );
    } else if (status.isRegistered) {
      badges.push(
        <Badge key="account" variant="outline">
          Account Only
        </Badge>
      );
    }
    
    return badges;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      sent: "default",
      failed: "destructive",
      pending: "secondary",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const getEmailTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-100 text-blue-800",
      thank_you: "bg-green-100 text-green-800",
      notification: "bg-purple-100 text-purple-800",
      mailchimp_sync: "bg-orange-100 text-orange-800",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Email Logs Dashboard</h1>
            <p className="text-muted-foreground">Monitor all email activity and Mailchimp syncs</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleBackfill()}
              disabled={isBackfilling}
              variant="default"
              className="gap-2"
            >
              {isBackfilling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Backfill All
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowEmailInput(!showEmailInput)}
              disabled={isBackfilling}
              variant="outline"
              className="gap-2"
            >
              Target Specific
            </Button>
          </div>
        </div>

        {/* Targeted Email Input */}
        {showEmailInput && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Target Specific Subscribers</CardTitle>
              <CardDescription>
                Search and select subscribers to send welcome emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected emails */}
              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                  {selectedEmails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveEmail(email)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Search input with autocomplete */}
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(inputValue.length > 0)}
                  placeholder="Search subscribers by email or name..."
                  className="bg-background text-foreground"
                  disabled={isBackfilling}
                />

                {/* Autocomplete dropdown */}
                {showSuggestions && filteredSubscribers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSubscribers.slice(0, 10).map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleAddEmail(sub.email)}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex flex-col"
                      >
                        <span className="font-medium text-foreground">{sub.email}</span>
                        {sub.name && (
                          <span className="text-sm text-muted-foreground">{sub.name}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEmailInput(false);
                    setSelectedEmails([]);
                    setInputValue("");
                  }}
                  disabled={isBackfilling}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTargetedBackfill}
                  disabled={isBackfilling || selectedEmails.length === 0}
                  className="gap-2"
                >
                  {isBackfilling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Send to ${selectedEmails.length} Selected`
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStatuses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-awareness">
                {userStatuses.filter(u => u.isSubscribed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registered Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {userStatuses.filter(u => u.isRegistered).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Both
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {userStatuses.filter(u => u.isSubscribed && u.isRegistered).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Status List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Users & Subscribers</CardTitle>
            <CardDescription>View subscription and registration status</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : userStatuses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userStatuses.map((user) => (
                  <div
                    key={user.email}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.email}</p>
                        {user.name && (
                          <p className="text-sm text-muted-foreground">{user.name}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadges(user)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Logs Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Email Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sent Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Email Activity Log</CardTitle>
                <CardDescription>Recent email sends and Mailchimp syncs</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchLogs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No email logs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEmailTypeBadge(log.email_type)}
                        {getStatusBadge(log.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{log.recipient_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Function: {log.edge_function_name}
                      </p>
                      {log.error_message && (
                        <p className="text-sm text-red-600 mt-2">
                          Error: {log.error_message}
                        </p>
                      )}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="text-xs mt-2">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            View metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EmailLogsAdmin;
