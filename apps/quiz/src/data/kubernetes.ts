import type { QuizQuestion } from '../quiz/types';

/**
 * Kubernetes questions, pitched at a Senior DevOps interview.
 *
 * Weighted towards triage and trade-offs rather than API trivia — what a
 * senior engineer is actually asked is "it is broken, what do you look at",
 * not "name the fields of a PodSpec".
 */
export const kubernetesQuestions: QuizQuestion[] = [
  {
    id: 'k8s-triage-1',
    topic: 'kubernetes',
    category: 'Troubleshooting',
    difficulty: 'core',
    prompt:
      'After a node-pool upgrade, several pods sit in Pending. What do you check first?',
    options: [
      { id: 'a', text: '`kubectl describe pod` for scheduler events — capacity, taints, affinity' },
      { id: 'b', text: 'Raise the container CPU limit' },
      { id: 'c', text: 'Restart the kubelet on every node' },
      { id: 'd', text: 'Delete and recreate the Deployment' },
    ],
    correctOptionId: 'a',
    explanation:
      'Pending means the scheduler could not place the pod, and it records exactly why in the pod events — insufficient CPU or memory, an untolerated taint, an unsatisfiable nodeSelector, or no matching volume zone. Raising a CPU limit makes placement harder, not easier.',
    reference: {
      label: 'Kubernetes — Scheduling and eviction',
      url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/',
    },
  },
  {
    id: 'k8s-triage-2',
    topic: 'kubernetes',
    category: 'Troubleshooting',
    difficulty: 'core',
    prompt: 'A container shows `OOMKilled` with exit code 137. What happened?',
    options: [
      { id: 'a', text: 'It exceeded its memory limit and the kernel OOM killer terminated it' },
      { id: 'b', text: 'It exceeded its CPU limit and was throttled to a halt' },
      { id: 'c', text: 'The liveness probe failed three times' },
      { id: 'd', text: 'The node ran out of disk and evicted it' },
    ],
    correctOptionId: 'a',
    explanation:
      'Exceeding a memory limit is fatal: memory is incompressible, so the container is killed rather than slowed. CPU is compressible and produces throttling instead. Disk pressure causes eviction, which shows a different reason on the pod.',
    reference: {
      label: 'Kubernetes — Resource management for pods',
      url: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
    },
  },
  {
    id: 'k8s-triage-3',
    topic: 'kubernetes',
    category: 'Troubleshooting',
    difficulty: 'advanced',
    prompt:
      'Latency spikes at low average CPU. Containers have `requests: 100m, limits: 200m`. What is the likely cause?',
    options: [
      { id: 'a', text: 'CFS throttling — the container hits its quota in bursts within each period' },
      { id: 'b', text: 'The node is out of memory' },
      { id: 'c', text: 'The HPA is scaling down too aggressively' },
      { id: 'd', text: 'The readiness probe is removing pods from the Service' },
    ],
    correctOptionId: 'a',
    explanation:
      'A CPU limit is enforced as a CFS quota per 100ms period. A bursty workload can exhaust its slice early and then be throttled for the rest of the period, producing latency spikes while average utilisation still looks low. Check `container_cpu_cfs_throttled_periods_total` before adding replicas.',
    reference: {
      label: 'Kubernetes — CPU limits and CFS quota',
      url: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/',
    },
  },
  {
    id: 'k8s-triage-4',
    topic: 'kubernetes',
    category: 'Troubleshooting',
    difficulty: 'core',
    prompt: 'What distinguishes `CrashLoopBackOff` from `ImagePullBackOff`?',
    options: [
      { id: 'a', text: 'CrashLoopBackOff means the container starts then exits; ImagePullBackOff means it never started' },
      { id: 'b', text: 'They are aliases for the same state' },
      { id: 'c', text: 'CrashLoopBackOff is a scheduler failure; ImagePullBackOff is a kubelet failure' },
      { id: 'd', text: 'CrashLoopBackOff only applies to init containers' },
    ],
    correctOptionId: 'a',
    explanation:
      'CrashLoopBackOff means the image ran and the process exited, repeatedly, with the kubelet backing off between restarts — look at `kubectl logs --previous`. ImagePullBackOff means the image could not be fetched at all: wrong tag, wrong registry, or missing pull credentials.',
    reference: {
      label: 'Kubernetes — Debug running pods',
      url: 'https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/',
    },
  },
  {
    id: 'k8s-workload-1',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'advanced',
    prompt:
      '`kubectl drain` hangs on one node. A Deployment has 2 replicas and a PDB with `minAvailable: 2`. Why?',
    options: [
      { id: 'a', text: 'Evicting either pod would breach the budget, so eviction is refused indefinitely' },
      { id: 'b', text: 'PDBs are advisory and do not affect drain' },
      { id: 'c', text: 'Drain ignores PDBs unless --force is passed' },
      { id: 'd', text: 'The PDB applies only to StatefulSets' },
    ],
    correctOptionId: 'a',
    explanation:
      'A PDB requiring all replicas to stay available makes voluntary eviction impossible — drain waits forever rather than violating it. `minAvailable` must leave headroom: with 2 replicas use `minAvailable: 1` or `maxUnavailable: 1`, and raise the replica count if you need both up during maintenance.',
    reference: {
      label: 'Kubernetes — Disruptions and PodDisruptionBudget',
      url: 'https://kubernetes.io/docs/concepts/workloads/pods/disruptions/',
    },
  },
  {
    id: 'k8s-workload-2',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'advanced',
    prompt:
      'A pod sets memory `requests: 1Gi` and no limit, and CPU `requests: 500m, limits: 500m`. What QoS class is it?',
    options: [
      { id: 'a', text: 'Burstable' },
      { id: 'b', text: 'Guaranteed' },
      { id: 'c', text: 'BestEffort' },
      { id: 'd', text: 'Guaranteed for CPU, BestEffort for memory' },
    ],
    correctOptionId: 'a',
    explanation:
      'Guaranteed requires every container to set both requests and limits, equal, for both CPU and memory. The missing memory limit makes this Burstable — which matters under node pressure, since Burstable pods are evicted before Guaranteed ones. QoS is a whole-pod property, never per-resource.',
    reference: {
      label: 'Kubernetes — Pod Quality of Service classes',
      url: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/',
    },
  },
  {
    id: 'k8s-workload-3',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'core',
    prompt:
      'Which workload guarantees stable network identity and ordered, graceful deployment?',
    options: [
      { id: 'a', text: 'StatefulSet' },
      { id: 'b', text: 'Deployment' },
      { id: 'c', text: 'DaemonSet' },
      { id: 'd', text: 'ReplicaSet' },
    ],
    correctOptionId: 'a',
    explanation:
      'StatefulSet gives each pod a stable ordinal name and a stable per-pod DNS record via a headless Service, and rolls out in order. Deployment pods have random suffixes and are interchangeable, which is what you want for stateless work and precisely what a clustered database cannot use.',
    reference: {
      label: 'Kubernetes — StatefulSets',
      url: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/',
    },
  },
  {
    id: 'k8s-workload-4',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'advanced',
    prompt:
      'A slow-booting app is killed repeatedly during startup. Which probe fixes it properly?',
    options: [
      { id: 'a', text: 'A startupProbe, which suspends the liveness probe until boot completes' },
      { id: 'b', text: 'Raise the liveness probe `initialDelaySeconds` to cover the worst case' },
      { id: 'c', text: 'Remove the liveness probe' },
      { id: 'd', text: 'Convert the liveness probe to a readiness probe' },
    ],
    correctOptionId: 'a',
    explanation:
      'A startupProbe exists for exactly this: liveness and readiness are held off until it first succeeds, so a slow boot is tolerated without permanently weakening liveness detection. Inflating `initialDelaySeconds` works but leaves the container unmonitored for that whole window on every restart.',
    reference: {
      label: 'Kubernetes — Configure liveness, readiness and startup probes',
      url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
    },
  },
  {
    id: 'k8s-workload-5',
    topic: 'kubernetes',
    category: 'Workloads',
    difficulty: 'core',
    prompt:
      'A rolling update must never reduce capacity below 100%. What do you set?',
    options: [
      { id: 'a', text: '`maxUnavailable: 0` with `maxSurge` of at least 1' },
      { id: 'b', text: '`maxUnavailable: 1` with `maxSurge: 0`' },
      { id: 'c', text: '`strategy: Recreate`' },
      { id: 'd', text: 'Both values to 0' },
    ],
    correctOptionId: 'a',
    explanation:
      '`maxUnavailable: 0` forbids dropping below the desired count, so a positive `maxSurge` is required to give the rollout room to add a new pod before removing an old one. Setting both to zero is rejected — the rollout could never make progress.',
    reference: {
      label: 'Kubernetes — Deployment rolling update strategy',
      url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    },
  },
  {
    id: 'k8s-net-1',
    topic: 'kubernetes',
    category: 'Networking',
    difficulty: 'advanced',
    prompt:
      'A NetworkPolicy selecting an app allows ingress from a frontend. DNS then breaks for those pods. Why?',
    options: [
      { id: 'a', text: 'Selecting a pod for ingress does not restrict egress — but a policy with an egress section does, and DNS to kube-dns must be allowed explicitly' },
      { id: 'b', text: 'NetworkPolicies always block DNS' },
      { id: 'c', text: 'CoreDNS must be listed in every ingress rule' },
      { id: 'd', text: 'DNS uses UDP, which NetworkPolicy cannot express' },
    ],
    correctOptionId: 'a',
    explanation:
      'Policies are additive and per-direction. An ingress-only policy leaves egress untouched, but the moment a policy includes an egress section the pod is isolated for egress and everything not permitted is denied — including UDP/TCP 53 to kube-dns. This is the classic self-inflicted outage when introducing default-deny.',
    reference: {
      label: 'Kubernetes — Network policies',
      url: 'https://kubernetes.io/docs/concepts/services-networking/network-policies/',
    },
  },
  {
    id: 'k8s-net-2',
    topic: 'kubernetes',
    category: 'Networking',
    difficulty: 'core',
    prompt: 'What does a headless Service (`clusterIP: None`) provide?',
    options: [
      { id: 'a', text: 'DNS A records for the individual pod IPs, with no virtual IP or proxying' },
      { id: 'b', text: 'A ClusterIP that skips kube-proxy' },
      { id: 'c', text: 'An external load balancer without a public IP' },
      { id: 'd', text: 'A Service that only accepts internal traffic' },
    ],
    correctOptionId: 'a',
    explanation:
      'A headless Service allocates no virtual IP; DNS returns the pod addresses directly, letting the client choose. It is what gives StatefulSet pods individually addressable DNS names, and what clients doing their own topology-aware balancing need.',
    reference: {
      label: 'Kubernetes — Headless Services',
      url: 'https://kubernetes.io/docs/concepts/services-networking/service/#headless-services',
    },
  },
  {
    id: 'k8s-net-3',
    topic: 'kubernetes',
    category: 'Networking',
    difficulty: 'advanced',
    prompt:
      'A Service has endpoints but connections time out. Pods are Running. What is the most likely cause?',
    options: [
      { id: 'a', text: 'The readiness probe is failing, so pods are excluded from the endpoint list' },
      { id: 'b', text: 'The Service selector is wrong' },
      { id: 'c', text: 'The ClusterIP range is exhausted' },
      { id: 'd', text: 'kube-proxy is not installed' },
    ],
    correctOptionId: 'a',
    explanation:
      'Running is not the same as Ready. A pod failing readiness is dropped from the Service EndpointSlice and receives no traffic, while still showing Running. Compare `kubectl get endpointslices` against the pod list — a wrong selector would instead leave the Service with no endpoints at all.',
    reference: {
      label: 'Kubernetes — Debug Services',
      url: 'https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/',
    },
  },
  {
    id: 'k8s-rbac-1',
    topic: 'kubernetes',
    category: 'Security & RBAC',
    difficulty: 'core',
    prompt:
      'You need to grant read access to Secrets in one namespace only. Which pair?',
    options: [
      { id: 'a', text: 'A Role plus a RoleBinding in that namespace' },
      { id: 'b', text: 'A ClusterRole plus a ClusterRoleBinding' },
      { id: 'c', text: 'A ClusterRole plus a RoleBinding in that namespace' },
      { id: 'd', text: 'A Role plus a ClusterRoleBinding' },
    ],
    correctOptionId: 'a',
    explanation:
      'A namespaced Role with a RoleBinding is the tightest fit. A ClusterRole bound by a RoleBinding also scopes access to that namespace and is useful for reusing one definition across many — but the question asks for a single namespace, where the plain Role is the least-privilege answer. A Role with a ClusterRoleBinding is invalid.',
    reference: {
      label: 'Kubernetes — RBAC authorization',
      url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/',
    },
  },
  {
    id: 'k8s-rbac-2',
    topic: 'kubernetes',
    category: 'Security & RBAC',
    difficulty: 'advanced',
    prompt:
      'Which statement about ServiceAccount tokens in modern Kubernetes is correct?',
    options: [
      { id: 'a', text: 'Tokens are short-lived, audience-bound and projected into the pod; they are no longer auto-created as long-lived Secrets' },
      { id: 'b', text: 'Every ServiceAccount still gets a permanent token Secret automatically' },
      { id: 'c', text: 'Tokens never expire, which is why they must be rotated manually' },
      { id: 'd', text: 'Tokens are shared across all pods in a namespace' },
    ],
    correctOptionId: 'a',
    explanation:
      'Since the BoundServiceAccountTokenVolume work, tokens are projected, time-limited and bound to a specific audience and pod, and the automatic long-lived token Secret is gone. This is exactly the mechanism AKS Workload ID federates against.',
    reference: {
      label: 'Kubernetes — ServiceAccount tokens',
      url: 'https://kubernetes.io/docs/concepts/security/service-accounts/',
    },
  },
  {
    id: 'k8s-rbac-3',
    topic: 'kubernetes',
    category: 'Security & RBAC',
    difficulty: 'advanced',
    prompt:
      'Which container setting most directly prevents a compromised process from gaining new privileges?',
    options: [
      { id: 'a', text: '`allowPrivilegeEscalation: false`' },
      { id: 'b', text: '`runAsNonRoot: true`' },
      { id: 'c', text: '`readOnlyRootFilesystem: true`' },
      { id: 'd', text: 'Dropping the NET_RAW capability' },
    ],
    correctOptionId: 'a',
    explanation:
      'That flag sets `no_new_privs` on the process, blocking gains via setuid binaries or file capabilities. The others are all worth setting and are part of the restricted Pod Security Standard, but they harden different things — who you start as, whether you can write, and what raw sockets you can open.',
    reference: {
      label: 'Kubernetes — Pod Security Standards',
      url: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/',
    },
  },
  {
    id: 'k8s-sched-1',
    topic: 'kubernetes',
    category: 'Scheduling',
    difficulty: 'advanced',
    prompt: 'What is the difference between a taint and a node affinity rule?',
    options: [
      { id: 'a', text: 'A taint lets a node repel pods; affinity lets a pod express where it wants to go' },
      { id: 'b', text: 'They are equivalent, expressed from different objects' },
      { id: 'c', text: 'Taints are hard constraints; affinity is always soft' },
      { id: 'd', text: 'Taints apply to namespaces; affinity applies to pods' },
    ],
    correctOptionId: 'a',
    explanation:
      'Taints are node-side repulsion and need a matching toleration; affinity is pod-side attraction. The distinction matters because a toleration only permits scheduling, it does not require it — reserving nodes for a workload normally needs a taint *and* a matching affinity or nodeSelector.',
    reference: {
      label: 'Kubernetes — Taints and tolerations',
      url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/',
    },
  },
  {
    id: 'k8s-sched-2',
    topic: 'kubernetes',
    category: 'Scheduling',
    difficulty: 'advanced',
    prompt:
      'All replicas of a Deployment land in one availability zone. Which mechanism spreads them?',
    options: [
      { id: 'a', text: 'topologySpreadConstraints on the zone topology key' },
      { id: 'b', text: 'A higher replica count' },
      { id: 'c', text: 'resources.requests tuning' },
      { id: 'd', text: 'A PodDisruptionBudget' },
    ],
    correctOptionId: 'a',
    explanation:
      'Topology spread constraints express a maximum skew across a topology domain such as `topology.kubernetes.io/zone`, and are the supported way to get even distribution. A PDB limits voluntary disruption but has no influence on placement; more replicas without a constraint just means more pods in the same zone.',
    reference: {
      label: 'Kubernetes — Pod topology spread constraints',
      url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/',
    },
  },
  {
    id: 'k8s-storage-1',
    topic: 'kubernetes',
    category: 'Storage',
    difficulty: 'advanced',
    prompt:
      'A PVC is deleted and its cloud disk vanishes with the data. Which setting caused this?',
    options: [
      { id: 'a', text: 'The StorageClass reclaim policy was Delete' },
      { id: 'b', text: 'The access mode was ReadWriteOnce' },
      { id: 'c', text: 'The volume binding mode was WaitForFirstConsumer' },
      { id: 'd', text: 'The PV was statically provisioned' },
    ],
    correctOptionId: 'a',
    explanation:
      '`reclaimPolicy: Delete` — the default for most dynamic StorageClasses — destroys the backing volume when the PVC goes. Use `Retain` for anything whose loss would matter; the PV then survives in Released state for manual recovery. Access mode governs concurrent mounting, not lifecycle.',
    reference: {
      label: 'Kubernetes — Persistent volume reclaiming',
      url: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming',
    },
  },
];
