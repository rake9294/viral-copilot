"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Scripts {
  short: string;
  demonstrative: string;
}

interface ScriptEditorProps {
  scripts: Scripts;
}

export function ScriptEditor({ scripts }: ScriptEditorProps) {
  const [activeTab, setActiveTab] = useState("short");
  const [editing, setEditing] = useState(false);
  const [shortText, setShortText] = useState(scripts.short);
  const [demoText, setDemoText] = useState(scripts.demonstrative);

  return (
    <Card className="bg-surface p-5 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-heading-sm text-foreground">
          2 Scripts
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
          {editing ? "Verrouiller" : "Éditer"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="short">Court (15-30s)</TabsTrigger>
          <TabsTrigger value="demonstrative">Démonstratif (45-60s)</TabsTrigger>
        </TabsList>

        <TabsContent value="short">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">15-30s</Badge>
            <span className="text-label-sm text-subtle">Format viral</span>
          </div>
          {editing ? (
            <textarea
              className="w-full min-h-[120px] bg-background text-body-sm text-foreground rounded-md p-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={shortText}
              onChange={(e) => setShortText((e.target as HTMLTextAreaElement).value)}
            />
          ) : (
            <pre className="text-body-sm text-muted whitespace-pre-wrap font-sans">
              {shortText}
            </pre>
          )}
        </TabsContent>

        <TabsContent value="demonstrative">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary">45-60s</Badge>
            <span className="text-label-sm text-subtle">Format démo</span>
          </div>
          {editing ? (
            <textarea
              className="w-full min-h-[120px] bg-background text-body-sm text-foreground rounded-md p-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={demoText}
              onChange={(e) => setDemoText((e.target as HTMLTextAreaElement).value)}
            />
          ) : (
            <pre className="text-body-sm text-muted whitespace-pre-wrap font-sans">
              {demoText}
            </pre>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}