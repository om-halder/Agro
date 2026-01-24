---
name: Production Deployment Checklist
about: Complete checklist before launching to production
---

# 🚀 Production Deployment Checklist

## Pre-Launch (48 hours before)

### Infrastructure
- [ ] MongoDB cluster created and tested
- [ ] API keys generated (OpenAI, Gemini, Firebase)
- [ ] Domain name purchased and configured
- [ ] SSL certificate prepared
- [ ] Hosting account created (Vercel, Railway, etc.)

### Configuration
- [ ] `.env.production` updated with all real values
- [ ] Database connection string verified
- [ ] API endpoints tested with real keys
- [ ] CORS whitelist configured
- [ ] JWT secret changed from default
- [ ] Firebase credentials verified

### Code
- [ ] All tests passing
- [ ] No console.logs left (should be removed in production build)
- [ ] No hardcoded URLs or credentials
- [ ] Error handling implemented
- [ ] Sensitive data not logged
- [ ] Latest dependencies installed

### Documentation
- [ ] Team has access to deployment docs
- [ ] Rollback procedure documented
- [ ] Contact list for incident response
- [ ] Monitoring setup documented

---

## Launch Day

### Pre-Deployment (1 hour before)
- [ ] Database backups created
- [ ] All team members notified
- [ ] Incident response team on standby
- [ ] Monitoring dashboards open

### Deployment

#### Option 1: Docker
```bash
docker-compose -f docker-compose.yml up -d
```
- [ ] All services started successfully
- [ ] Containers healthy (no restart loops)
- [ ] Logs checked for errors

#### Option 2: Manual
- [ ] Frontend built: `npm run build`
- [ ] Backend started: `npm start`
- [ ] ML service running (if applicable)
- [ ] All ports accessible

### Post-Deployment (30 minutes after)
- [ ] Health check passing: `curl /health`
- [ ] Frontend loading correctly
- [ ] API responding to requests
- [ ] Database queries working
- [ ] Authentication functional
- [ ] Error tracking working (Sentry)
- [ ] Logs being collected

### First Hour Monitoring
- [ ] Error rate normal
- [ ] Response times acceptable
- [ ] No unusual database queries
- [ ] Memory/CPU usage stable
- [ ] No failed deployments
- [ ] User reports normal

---

## First Week Monitoring

### Daily
- [ ] Check error logs (morning & evening)
- [ ] Monitor API response times
- [ ] Verify backup completion
- [ ] Check disk space usage

### Weekly
- [ ] Review error trends
- [ ] Update any critical dependencies
- [ ] Performance analysis
- [ ] Security audit

---

## Ongoing Maintenance

### Monthly
- [ ] Dependency updates
- [ ] Database optimization
- [ ] Security patches
- [ ] Capacity planning

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Disaster recovery test
- [ ] Documentation update

### Annually
- [ ] Full security penetration test
- [ ] Architecture review
- [ ] Cost optimization
- [ ] Compliance check

---

## Rollback Procedure

If issues occur:

```bash
# 1. Stop current deployment
docker-compose -f docker-compose.yml down

# 2. Checkout previous version
git checkout <previous-tag>

# 3. Restart with previous version
docker-compose -f docker-compose.yml up -d

# 4. Verify health
curl http://localhost:5000/health
```

---

## Emergency Contacts

- **DevOps Lead**: 
- **Backend Lead**: 
- **Frontend Lead**: 
- **Database Admin**: 
- **On-Call Support**: 

---

## Incident Response

**If something goes wrong:**

1. **Immediate** (< 5 min)
   - [ ] Page on-call team
   - [ ] Assess severity
   - [ ] Start investigating

2. **Short-term** (5-30 min)
   - [ ] Communicate status to team
   - [ ] Decide on rollback
   - [ ] Document findings

3. **Medium-term** (30 min - 2 hours)
   - [ ] Root cause analysis
   - [ ] Implement fix
   - [ ] Deploy fix if safe
   - [ ] Monitor closely

4. **Follow-up** (Next 48 hours)
   - [ ] Post-mortem meeting
   - [ ] Document lessons learned
   - [ ] Update procedures
   - [ ] Send to stakeholders

---

## Sign-Off

- [ ] Product Owner: __________________ Date: __________
- [ ] Tech Lead: __________________ Date: __________
- [ ] DevOps: __________________ Date: __________
- [ ] Security: __________________ Date: __________

---

## Resources

- [Deployment Guide](PRODUCTION_DEPLOYMENT.md)
- [Quick Start](PRODUCTION_QUICKSTART.md)
- [Setup Complete](SETUP_COMPLETE.md)
- Docker Docs: https://docs.docker.com
- MongoDB Docs: https://docs.mongodb.com

---

**Remember: A successful launch requires preparation, monitoring, and communication.**
