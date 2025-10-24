import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TablePageSizeSelector } from "@/components/ui/tablepagesizeselector";
import { useTranslation } from "react-i18next";

export default function Subscription() {
  useAuth("admin");
  const { toast } = useToast();
  const { t } = useTranslation();

  // Dummy data (to be replaced with actual data)
  const currentPlan = "gold";
  const plans = [
    {
      id: 1,
      name: "Silver (Basic)",
      price: 29,
      maxStaff: 2,
      maxProducts: 500,
      features: [
        { name: "Basic POS", included: true },
        { name: "Customer Management", included: true },
        { name: "Supplier Management", included: true },
        { name: "Barcode Printing/Scanning", included: true },
        { name: "Basic Reports (Sales, Profit)", included: true },
        { name: "Advanced Analytics", included: false },
        { name: "Loyalty Program", included: false },
        { name: "Gift Cards", included: false },
        { name: "Purchase Order Management", included: false },
        { name: "Multi-Warehouse Management", included: false },
        { name: "API Access", included: false },
        { name: "Premium Support", included: false },
      ]
    },
    {
      id: 2,
      name: "Gold (Growth)",
      price: 59,
      maxStaff: 5,
      maxProducts: 2000,
      features: [
        { name: "Basic POS", included: true },
        { name: "Customer Management", included: true },
        { name: "Supplier Management", included: true },
        { name: "Barcode Printing/Scanning", included: true },
        { name: "Basic Reports (Sales, Profit)", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Loyalty Program", included: false },
        { name: "Gift Cards", included: false },
        { name: "Purchase Order Management", included: false },
        { name: "Multi-Warehouse Management", included: false },
        { name: "API Access", included: false },
        { name: "Premium Support", included: false },
      ]
    },
    {
      id: 3,
      name: "Platinum (Enterprise)",
      price: 119,
      maxStaff: "Unlimited",
      maxProducts: "Unlimited",
      features: [
        { name: "Basic POS", included: true },
        { name: "Customer Management", included: true },
        { name: "Supplier Management", included: true },
        { name: "Barcode Printing/Scanning", included: true },
        { name: "Basic Reports (Sales, Profit)", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Loyalty Program", included: true },
        { name: "Gift Cards", included: true },
        { name: "Purchase Order Management", included: true },
        { name: "Multi-Warehouse Management", included: true },
        { name: "API Access", included: true },
        { name: "Premium Support", included: true },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Subscription</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription plan</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-chart-2">
        <div className="flex items-start justify-between text-primary-foreground">
          <div>
            <h3 className="text-xl font-semibold mb-2">Current Plan</h3>
            <p className="text-3xl font-bold capitalize">{currentPlan}</p>
            <p className="mt-2 opacity-90">Active until: Dec 31, 2025</p>
          </div>
          <Crown className="w-12 h-12 opacity-80" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.name.toLowerCase() === currentPlan;
          return (
            <Card key={plan.id} className={isCurrent ? "border-primary border-2" : ""}>
              <div className="p-6 space-y-4">
                <div>
                  {isCurrent && <Badge className="mb-2">Current Plan</Badge>}
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-sm">
                    <span className="font-medium">Max Staff:</span>
                    <span className="ml-auto">{plan.maxStaff}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">Max Products:</span>
                    <span className="ml-auto">{plan.maxProducts}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${feature.included ? "text-chart-4" : "text-gray-400"}`}
                        />
                        <span className={`${feature.included ? "" : "text-gray-400"}`}>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant={isCurrent ? "outline" : "default"}
                  className="w-full mt-4"
                  disabled={isCurrent}
                  onClick={() =>
                    toast({
                      title: "Upgrade Plan",
                      description: `Upgrading to ${plan.name}`,
                    })
                  }
                  data-testid={`button-${isCurrent ? "current" : "upgrade"}-plan-${plan.id}`}
                >
                  {isCurrent ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
