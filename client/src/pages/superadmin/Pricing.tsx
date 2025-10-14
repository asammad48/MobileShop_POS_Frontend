import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, Edit } from 'lucide-react';
import { mockPricingPlans } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function PricingPlans() {
  useAuth('super_admin');
  const [plans] = useState(mockPricingPlans); //todo: remove mock functionality
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Pricing Plans</h1>
          <p className="text-muted-foreground mt-1">Manage subscription tiers</p>
        </div>
        <Button data-testid="button-add-plan">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-chart-2 p-6 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-sm opacity-90">/month</span>
                  </div>
                </div>
                {plan.isActive && (
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Active
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium">Max Staff:</span>
                  <span className="ml-auto">{plan.maxStaff}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium">Max Products:</span>
                  <span className="ml-auto">{plan.maxProducts}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Features</h4>
                <div className="space-y-2">
                  {plan.features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => toast({ title: 'Edit Plan', description: `Editing ${plan.name}` })}
                data-testid={`button-edit-plan-${plan.id}`}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
