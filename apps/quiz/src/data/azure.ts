import type { QuizQuestion } from '../quiz/types';

/**
 * Azure questions, pitched at a Senior DevOps interview: scenario-led rather
 * than definitional, with a plausible wrong answer in every set.
 *
 * Every answer and explanation here was checked against Microsoft Learn while
 * writing, and the `reference` is the page it was checked against. Interview
 * questions that are subtly wrong are worse than no questions at all.
 */
export const azureQuestions: QuizQuestion[] = [
  {
    id: 'az-identity-1',
    topic: 'azure',
    category: 'Identity & RBAC',
    difficulty: 'core',
    prompt:
      'You inherit an AKS cluster whose pods authenticate to Key Vault using AAD pod-managed identity. What should the migration target be?',
    options: [
      { id: 'a', text: 'Microsoft Entra Workload ID with a federated credential' },
      { id: 'b', text: 'A Kubernetes Secret holding a service principal client secret' },
      { id: 'c', text: 'The kubelet identity, granted Key Vault access' },
      { id: 'd', text: 'Assign the managed identity directly to the VM scale set' },
    ],
    correctOptionId: 'a',
    explanation:
      'Pod-managed identity is deprecated and should not be used for new workloads. Workload ID projects a Kubernetes service account token that is federated to a managed identity, so no secret is ever stored in the cluster. Using the kubelet identity would grant access to every pod on the node, not just the one that needs it.',
    reference: {
      label: 'Microsoft Learn — Workload ID overview',
      url: 'https://learn.microsoft.com/azure/aks/workload-identity-overview',
    },
  },
  {
    id: 'az-identity-2',
    topic: 'azure',
    category: 'Identity & RBAC',
    difficulty: 'advanced',
    prompt:
      'When creating a federated identity credential for AKS Workload ID, what is the correct `--subject` value?',
    options: [
      { id: 'a', text: 'system:serviceaccount:<namespace>:<serviceaccount>' },
      { id: 'b', text: 'system:pod:<namespace>:<pod-name>' },
      { id: 'c', text: 'The client ID of the user-assigned managed identity' },
      { id: 'd', text: 'The OIDC issuer URL of the cluster' },
    ],
    correctOptionId: 'a',
    explanation:
      'The subject identifies the Kubernetes service account in standard `system:serviceaccount:<ns>:<name>` form. The issuer URL is passed separately as `--issuer`, and the audience is `api://AzureADTokenExchange`. Federation is to a service account, not to individual pods.',
    reference: {
      label: 'Microsoft Learn — Establish federated credential trust',
      url: 'https://learn.microsoft.com/azure/aks/workload-identity-migrate-from-pod-identity',
    },
  },
  {
    id: 'az-identity-3',
    topic: 'azure',
    category: 'Identity & RBAC',
    difficulty: 'advanced',
    prompt:
      'Your AKS cluster cannot pull images from Azure Container Registry. Which identity needs the AcrPull role?',
    options: [
      { id: 'a', text: 'The kubelet identity' },
      { id: 'b', text: 'The control-plane identity' },
      { id: 'c', text: 'The workload identity used by the pod' },
      { id: 'd', text: 'The identity of whoever ran kubectl apply' },
    ],
    correctOptionId: 'a',
    explanation:
      'AKS uses several identities for different jobs. The kubelet identity runs on each node and is the one that authenticates to ACR to pull images. The control-plane identity manages Azure resources such as load balancers and disks; workload identity is for pod-to-Azure-service calls at runtime, which happens long after the image is pulled.',
    reference: {
      label: 'Microsoft Learn — Access and identity options for AKS',
      url: 'https://learn.microsoft.com/azure/aks/concepts-identity',
    },
  },
  {
    id: 'az-net-1',
    topic: 'azure',
    category: 'Networking',
    difficulty: 'core',
    prompt:
      'You are planning a cluster expected to reach 800 nodes. Which AKS network plugin is viable?',
    options: [
      { id: 'a', text: 'Azure CNI Overlay' },
      { id: 'b', text: 'kubenet' },
      { id: 'c', text: 'Either — the node limit is identical' },
      { id: 'd', text: 'Neither; AKS caps clusters at 500 nodes' },
    ],
    correctOptionId: 'a',
    explanation:
      'Azure CNI Overlay supports up to 5,000 nodes; kubenet tops out at 400, so 800 rules it out immediately. kubenet is also being retired on 31 March 2028, making it the wrong choice for any new build regardless of scale.',
    reference: {
      label: 'Microsoft Learn — Azure CNI Overlay vs kubenet',
      url: 'https://learn.microsoft.com/azure/aks/concepts-network-azure-cni-overlay',
    },
  },
  {
    id: 'az-net-2',
    topic: 'azure',
    category: 'Networking',
    difficulty: 'advanced',
    prompt:
      'With Azure CNI Overlay, how much pod address space does each node consume?',
    options: [
      { id: 'a', text: 'A fixed /24 carved from the pod CIDR' },
      { id: 'b', text: 'Exactly as many IPs as it has running pods' },
      { id: 'c', text: 'A /26, expandable via the max-pods setting' },
      { id: 'd', text: 'None — overlay pods share the node IP' },
    ],
    correctOptionId: 'a',
    explanation:
      'Each node gets a fixed /24 from the pod CIDR, which cannot be resized up or down, and supports up to 250 pods. This is why pod CIDR sizing is driven by your maximum expected node count rather than your pod count.',
    reference: {
      label: 'Microsoft Learn — CNI Overlay IP address planning',
      url: 'https://learn.microsoft.com/azure/aks/concepts-network-azure-cni-overlay',
    },
  },
  {
    id: 'az-net-3',
    topic: 'azure',
    category: 'Networking',
    difficulty: 'advanced',
    prompt:
      'An on-premises database at 10.10.0.0/16 is unreachable from pods. The cluster uses CNI Overlay with pod CIDR 10.10.0.0/16. What has gone wrong?',
    options: [
      { id: 'a', text: 'The pod CIDR overlaps the on-premises range, so traffic is routed into the overlay' },
      { id: 'b', text: 'ExpressRoute does not support overlay networking' },
      { id: 'c', text: 'The service CIDR must be larger than the pod CIDR' },
      { id: 'd', text: 'Overlay clusters cannot reach anything outside the VNet' },
    ],
    correctOptionId: 'a',
    explanation:
      'Pod CIDR must not overlap any directly connected network — peered VNets, ExpressRoute or VPN. When it does, packets bound for that external host get redirected into the overlay and SNATed by the node, and the real endpoint becomes unreachable. Overlay clusters otherwise reach external endpoints fine, via NAT to the node IP.',
    reference: {
      label: 'Microsoft Learn — CNI Overlay IP address planning',
      url: 'https://learn.microsoft.com/azure/aks/concepts-network-azure-cni-overlay',
    },
  },
  {
    id: 'az-net-4',
    topic: 'azure',
    category: 'Networking',
    difficulty: 'core',
    prompt: 'What is the constraint on the AKS Kubernetes service address range?',
    options: [
      { id: 'a', text: 'It must be smaller than /12 and must not overlap the pod CIDR or node subnet' },
      { id: 'b', text: 'It must be larger than /8 and sit inside the VNet' },
      { id: 'c', text: 'It must exactly match the pod CIDR' },
      { id: 'd', text: 'It must be a public range so services are routable' },
    ],
    correctOptionId: 'a',
    explanation:
      'The service CIDR must be smaller than /12 and must not collide with the pod CIDR, the cluster subnet, or ranges used in peered or on-premises networks. It is cluster-internal, so it is never public, and it can safely be reused across separate clusters.',
    reference: {
      label: 'Microsoft Learn — IP address planning for AKS',
      url: 'https://learn.microsoft.com/azure/aks/concepts-network-ip-address-planning',
    },
  },
  {
    id: 'az-scale-1',
    topic: 'azure',
    category: 'Scaling',
    difficulty: 'core',
    prompt:
      'Pods are stuck Pending because no node has capacity. Which autoscaler addresses this?',
    options: [
      { id: 'a', text: 'Cluster Autoscaler' },
      { id: 'b', text: 'Horizontal Pod Autoscaler' },
      { id: 'c', text: 'Vertical Pod Autoscaler' },
      { id: 'd', text: 'KEDA' },
    ],
    correctOptionId: 'a',
    explanation:
      'Pending because of insufficient node capacity is the Cluster Autoscaler trigger — it watches for unschedulable pods and adds nodes. HPA adds replicas, which makes the Pending queue longer rather than shorter. HPA and Cluster Autoscaler are usually run together, each handling its own layer.',
    reference: {
      label: 'Microsoft Learn — AKS scaling overview',
      url: 'https://learn.microsoft.com/azure/aks/concepts-scale',
    },
  },
  {
    id: 'az-scale-2',
    topic: 'azure',
    category: 'Scaling',
    difficulty: 'advanced',
    prompt:
      'A team adds a KEDA ScaledObject to a Deployment that already has an HPA on it. What happens?',
    options: [
      { id: 'a', text: 'The ScaledObject fails to create, because KEDA drives an HPA underneath' },
      { id: 'b', text: 'They cooperate, with KEDA taking priority' },
      { id: 'c', text: 'The HPA is deleted and replaced automatically' },
      { id: 'd', text: 'Both run, and the replica count is the sum of the two' },
    ],
    correctOptionId: 'a',
    explanation:
      'KEDA creates and manages an HPA internally, so pointing both at one workload makes them compete. If an HPA exists first, the ScaledObject fails to create; done in the other order the HPA is not blocked and scaling behaves erratically. Pick one mechanism per workload.',
    reference: {
      label: 'Microsoft Learn — KEDA add-on limitations',
      url: 'https://learn.microsoft.com/azure/aks/keda-about',
    },
  },
  {
    id: 'az-scale-3',
    topic: 'azure',
    category: 'Scaling',
    difficulty: 'advanced',
    prompt:
      'An HPA is configured with two metrics: CPU computes 5 replicas, requests-per-second computes 12. What does it do?',
    options: [
      { id: 'a', text: 'Scales to 12 — the largest of the per-metric results' },
      { id: 'b', text: 'Scales to 5 — the most conservative result' },
      { id: 'c', text: 'Scales to 8 or 9 — the average' },
      { id: 'd', text: 'Refuses to scale until the metrics agree' },
    ],
    correctOptionId: 'a',
    explanation:
      'The HPA controller computes a desired replica count for each metric independently and then takes the largest, before applying min/max bounds and behaviour policies. Picking the maximum is what keeps any single saturated dimension from being ignored.',
    reference: {
      label: 'Microsoft Learn — When to use HPA',
      url: 'https://learn.microsoft.com/azure/aks/horizontal-pod-autoscaler',
    },
  },
  {
    id: 'az-scale-4',
    topic: 'azure',
    category: 'Scaling',
    difficulty: 'advanced',
    prompt:
      'Why should VPA and HPA not both target CPU on the same workload?',
    options: [
      { id: 'a', text: 'They react to the same signal and fight — VPA resizes requests while HPA changes replica count' },
      { id: 'b', text: 'VPA is unsupported on AKS when HPA is enabled' },
      { id: 'c', text: 'HPA silently ignores any workload managed by VPA' },
      { id: 'd', text: 'It doubles the metrics-server load past its limit' },
    ],
    correctOptionId: 'a',
    explanation:
      'Both autoscalers respond to the same CPU or memory metric and interfere with each other. The supported combination is VPA on CPU/memory alongside HPA on custom metrics, so each owns a distinct signal.',
    reference: {
      label: 'Microsoft Learn — Performance and scaling best practices',
      url: 'https://learn.microsoft.com/azure/aks/best-practices-performance-scale',
    },
  },
  {
    id: 'az-scale-5',
    topic: 'azure',
    category: 'Scaling',
    difficulty: 'core',
    prompt:
      'A colleague runs `az aks scale` on a node pool with Cluster Autoscaler enabled. What is the outcome?',
    options: [
      { id: 'a', text: 'Manual scaling is disabled while the autoscaler manages the pool' },
      { id: 'b', text: 'It works, and the autoscaler adopts the new count as its minimum' },
      { id: 'c', text: 'It works once, then the autoscaler is silently disabled' },
      { id: 'd', text: 'It resizes every node pool in the cluster' },
    ],
    correctOptionId: 'a',
    explanation:
      'Enabling Cluster Autoscaler on a node pool disables manual scaling for it — the autoscaler owns the count between the configured minimum and maximum. To change capacity you adjust those bounds.',
    reference: {
      label: 'Microsoft Learn — Cluster autoscaling in AKS',
      url: 'https://learn.microsoft.com/azure/aks/cluster-autoscaler-overview',
    },
  },
  {
    id: 'az-secrets-1',
    topic: 'azure',
    category: 'Secrets',
    difficulty: 'advanced',
    prompt:
      'Key Vault secret rotation is enabled via the Secrets Store CSI driver, but one pod never sees new values. Its volume uses `subPath`. Why?',
    options: [
      { id: 'a', text: 'subPath volume mounts do not receive updates — a Kubernetes limitation' },
      { id: 'b', text: 'subPath is unsupported by the Azure Key Vault provider' },
      { id: 'c', text: 'Rotation only applies to certificates, not secrets' },
      { id: 'd', text: 'The poll interval must be under 60 seconds for subPath' },
    ],
    correctOptionId: 'a',
    explanation:
      'A container consuming a ConfigMap or Secret as a `subPath` mount never receives automated updates. This is a Kubernetes limitation rather than anything Azure-specific, and the fix is to mount the whole volume or restart the pod on change.',
    reference: {
      label: 'Microsoft Learn — Secrets Store CSI driver limitations',
      url: 'https://learn.microsoft.com/azure/aks/csi-secrets-store-driver',
    },
  },
  {
    id: 'az-secrets-2',
    topic: 'azure',
    category: 'Secrets',
    difficulty: 'core',
    prompt:
      'What is the default rotation poll interval for the Azure Key Vault provider for Secrets Store CSI Driver?',
    options: [
      { id: 'a', text: 'Two minutes' },
      { id: 'b', text: 'Thirty seconds' },
      { id: 'c', text: 'One hour' },
      { id: 'd', text: 'Twenty-four hours' },
    ],
    correctOptionId: 'a',
    explanation:
      'The default is two minutes, tunable with `--rotation-poll-interval`. Rotation is polled, not pushed, so there is always a window in which a pod holds a stale value — worth stating explicitly when designing a rotation SLA.',
    reference: {
      label: 'Microsoft Learn — CSI driver configuration options',
      url: 'https://learn.microsoft.com/azure/aks/csi-secrets-store-configuration-options',
    },
  },
  {
    id: 'az-secrets-3',
    topic: 'azure',
    category: 'Secrets',
    difficulty: 'advanced',
    prompt:
      'Your app reads a rotated secret from an environment variable sourced from a synced Kubernetes Secret. What is required for it to pick up a new value?',
    options: [
      { id: 'a', text: 'Restart the pod — environment variables are fixed at container start' },
      { id: 'b', text: 'Nothing; env vars update in place when the Secret changes' },
      { id: 'c', text: 'Re-run the SecretProviderClass reconciler' },
      { id: 'd', text: 'Shorten the poll interval below the app read interval' },
    ],
    correctOptionId: 'a',
    explanation:
      'Environment variables are set once when the container starts and never change afterwards. Rotation reaches env-var consumers only through a pod restart — commonly automated with a watcher such as Reloader. Mounted files, by contrast, do update in place.',
    reference: {
      label: 'Microsoft Learn — Autorotation and secret sync',
      url: 'https://learn.microsoft.com/azure/aks/csi-secrets-store-configuration-options',
    },
  },
  {
    id: 'az-ops-1',
    topic: 'azure',
    category: 'Operations',
    difficulty: 'advanced',
    prompt:
      'Which statement about network policy on AKS reflects current guidance?',
    options: [
      { id: 'a', text: 'Azure CNI Powered by Cilium is recommended; Azure NPM is on a deprecation path' },
      { id: 'b', text: 'Azure NPM is the only supported option on Linux' },
      { id: 'c', text: 'Network policies require kubenet' },
      { id: 'd', text: 'AKS does not support network policy; use NSGs instead' },
    ],
    correctOptionId: 'a',
    explanation:
      'Azure CNI Powered by Cilium provides an eBPF data plane with built-in policy enforcement and is the current recommendation. Azure NPM support ends on Windows nodes in September 2026 and on Linux nodes in September 2028. NSGs operate at the subnet or NIC level and cannot express pod-level policy.',
    reference: {
      label: 'Microsoft Learn — Network policy options in AKS',
      url: 'https://learn.microsoft.com/azure/aks/use-network-policies',
    },
  },
  {
    id: 'az-ops-2',
    topic: 'azure',
    category: 'Operations',
    difficulty: 'core',
    prompt:
      'Enabling the Key Vault CSI add-on creates a managed identity. Where does it live?',
    options: [
      { id: 'a', text: 'In the node resource group (the MC_ group), assigned to the VM scale set' },
      { id: 'b', text: 'In the same resource group as the AKS resource' },
      { id: 'c', text: 'In the Key Vault resource group' },
      { id: 'd', text: 'No identity is created; the add-on uses the control-plane identity' },
    ],
    correctOptionId: 'a',
    explanation:
      'The add-on creates `azurekeyvaultsecretsprovider-xxxxx` in the MC_ node resource group and assigns it to the scale set automatically. You can grant it Key Vault access or substitute your own identity, but you cannot prevent its creation.',
    reference: {
      label: 'Microsoft Learn — Secrets Store CSI driver limitations',
      url: 'https://learn.microsoft.com/azure/aks/csi-secrets-store-driver',
    },
  },
  {
    id: 'az-ops-3',
    topic: 'azure',
    category: 'Operations',
    difficulty: 'advanced',
    prompt:
      'Which workload profile is the strongest case for KEDA over a plain HPA?',
    options: [
      { id: 'a', text: 'A queue consumer that should sit at zero replicas when the queue is empty' },
      { id: 'b', text: 'A web API that should track CPU utilisation' },
      { id: 'c', text: 'A single-threaded job needing a bigger memory request' },
      { id: 'd', text: 'A DaemonSet that must run on every node' },
    ],
    correctOptionId: 'a',
    explanation:
      'Scale-to-zero on an event backlog is exactly what KEDA adds; a stock HPA has a minimum of one replica and no native queue-depth source. CPU-tracking web APIs are plain HPA territory, right-sizing a single-threaded job is VPA, and a DaemonSet is not autoscaled at all.',
    reference: {
      label: 'Microsoft Learn — KEDA add-on overview',
      url: 'https://learn.microsoft.com/azure/aks/keda-about',
    },
  },
];
